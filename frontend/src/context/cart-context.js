import { createContext, useContext, useEffect, useState } from "react";

// ================== 1. Khởi tạo Context & Hook ==================
const CartContext = createContext();

export default function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // ================== 2. State quản lý ==================
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  // ================== 3. Khởi tạo & đồng bộ dữ liệu (useEffect) ==================
  // Lấy giỏ hàng từ localStorage khi load trang
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Khi token thay đổi → đồng bộ giỏ hàng
  useEffect(() => {
    if (token) {
      fetchCartItems();
      syncLocalCartToBackend(token);
    }
  }, [token]);

  // ================== 4. Quản lý token & phiên đăng nhập ==================
  const updateToken = (newToken) => {
    setToken(newToken);
  };

  const logOut = () => {
    setCartItems([]);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role_id");
    localStorage.removeItem("cart");
  };

  // ================== 5. Đồng bộ dữ liệu với backend ==================
  const fetchCartItems = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8080/carts/current_user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Thất bại");

      const data = await res.json();
      setCartItems(data.items || []);
    } catch (err) {
      console.error(err);
      setCartItems([]);
    }
  };

  const syncLocalCartToBackend = async (token) => {
    if (!token) return;

    const localCart = localStorage.getItem("cart");
    if (!localCart) return;

    const cartData = JSON.parse(localCart);
    for (const item of cartData) {
      await addToCart(
        {
          product_id: item.product_id,
        },
        item.quantity
      );
    }

    localStorage.removeItem("cart");
  };

  // ================== 6. Thao tác giỏ hàng (CRUD) ==================
  const addToCart = async (product, quantity) => {
    // KHÁCH CHƯA LOGIN → LOCALSTORAGE
    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItem = cart.find(
        (i) =>
          i.product_id === product.product_id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          product_id: product.product_id,
          product_name: product.product_name,
          price: product.price,
          quantity,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      return;
    }

    // USER ĐÃ LOGIN → BACKEND
    try {
      const res = await fetch("http://localhost:8080/carts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity
        }),
      });

      if (!res.ok) throw new Error("Không thể thêm sản phẩm");
      await fetchCartItems();
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (product_id, batch_id) => {
    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart = cart.filter(
        (item) =>
          !(item.product_id === product_id)
      );
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/carts/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id}),
      });

      if (!res.ok) throw new Error("Không thể xóa sản phẩm");

      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(item.product_id === product_id)
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateQuantity = async (product_id, quantity) => {
    if (!token) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const item = cart.find(
        (i) => i.product_id === product_id 
      );
      if (item) item.quantity = quantity;

      localStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/carts/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id, quantity }),
      });

      if (!res.ok) throw new Error("Không thể cập nhật số lượng");

      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === product_id 
            ? { ...item, quantity }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const increase = (product_id) => {
    const item = cartItems.find(
      (p) => p.product_id === product_id 
    );
    if (item) updateQuantity(product_id, item.quantity + 1);
  };

  const decrease = (product_id) => {
    const item = cartItems.find(
      (p) => p.product_id === product_id 
    );
    if (item && item.quantity > 1)
      updateQuantity(product_id, item.quantity - 1);
  };

  // ================== 7. Provider xuất giá trị ==================
  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        updateToken,
        logOut,
        fetchCartItems,
        syncLocalCartToBackend,
        addToCart,
        removeFromCart,
        updateQuantity,
        increase,
        decrease,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
