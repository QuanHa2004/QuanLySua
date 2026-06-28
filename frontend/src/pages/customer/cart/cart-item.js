import { useEffect, useState } from "react";
import useCart from "../../../context/cart-context";

export default function CartItem() {
  const {
    cartItems,
    setCartItems,
    removeFromCart,
    updateQuantity,
    increase,
    decrease,
    fetchCartItems,
  } = useCart();

  const token = localStorage.getItem("access_token");
  const [checkAll, setCheckAll] = useState(false);

  // ================= 1. Xử lý logic Checkbox =================

  // Theo dõi giỏ hàng: Nếu tất cả đều được chọn thì tick vào ô "Chọn tất cả"
  useEffect(() => {
    setCheckAll(cartItems.length > 0 && cartItems.every(item => item.is_checked));
  }, [cartItems]);

  // Gọi API (hoặc LocalStorage) để lưu trạng thái is_checked
  const updateItemStatus = async (product_id, is_checked) => {
    try {
      if (!token) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.map(item =>
          item.product_id === product_id ? { ...item, is_checked } : item
        );
        localStorage.setItem("cart", JSON.stringify(cart));
        return;
      }

      const res = await fetch(`http://localhost:8080/customer/carts/${product_id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_checked }),
      });

      if (!res.ok) throw new Error("Lỗi cập nhật trạng thái sản phẩm");
    } catch (err) {
      console.error(err);
      fetchCartItems(); // Rollback lại data từ server nếu gọi API lỗi
    }
  };

  // Click ô "Chọn tất cả"
  const handleCheckboxAll = () => {
    const newIsChecked = !cartItems.every(item => item.is_checked);

    // Cập nhật giao diện ngay lập tức
    const updated = cartItems.map(item => ({ ...item, is_checked: newIsChecked }));
    setCartItems(updated);

    // Lưu trạng thái
    updated.forEach(item => updateItemStatus(item.product_id, newIsChecked));
  };

  // Click ô checkbox của từng sản phẩm
  const handleCheckboxChange = (product_id, current_status) => {
    const newIsChecked = !current_status;

    setCartItems(prev =>
      prev.map(item =>
        item.product_id === product_id ? { ...item, is_checked: newIsChecked } : item
      )
    );

    updateItemStatus(product_id, newIsChecked);
  };

  // ================= 2. Giao diện =================

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-100 text-gray-500">
        Giỏ hàng của bạn đang trống.
      </div>
    );
  }

  return (
    <>
      {/* --- HEADER --- */}
      <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-4 border-b border-gray-200 bg-[#f8f9fa] text-sm font-bold text-[#1a3c7e] uppercase tracking-wide rounded-t-xl">
        <div className="col-span-1 flex justify-center items-center">
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#1a3c7e] cursor-pointer rounded border-gray-300"
            checked={checkAll}
            onChange={handleCheckboxAll}
          />
        </div>
        <div className="col-span-5">Sản phẩm</div>
        <div className="col-span-2 text-center">Đơn giá</div>
        <div className="col-span-2 text-center">Số lượng</div>
        <div className="col-span-2 text-right">Thành tiền</div>
      </div>

      {/* --- DANH SÁCH --- */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-100">
        {cartItems.map((product) => (
          <div
            key={product.product_id}
            className="group grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-4 md:px-6 md:py-6 border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition-colors duration-200"
          >
            {/* Cột Checkbox (Desktop) */}
            <div className="hidden md:flex col-span-1 justify-center">
              <input
                type="checkbox"
                checked={product.is_checked || false}
                onChange={() => handleCheckboxChange(product.product_id, product.is_checked)}
                className="w-5 h-5 accent-[#1a3c7e] cursor-pointer rounded border-gray-300"
              />
            </div>

            {/* Cột Thông tin Sản phẩm */}
            <div className="col-span-1 md:col-span-5 flex items-start gap-4">
              {/* Checkbox (Mobile) */}
              <div className="md:hidden flex items-center pr-2 pt-8">
                <input
                  type="checkbox"
                  checked={product.is_checked || false}
                  onChange={() => handleCheckboxChange(product.product_id, product.is_checked)}
                  className="w-5 h-5 accent-[#1a3c7e] cursor-pointer"
                />
              </div>

              <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                  className="w-20 h-20 md:w-24 md:h-24 bg-center bg-no-repeat bg-contain bg-white border border-gray-100 rounded-lg"
                  style={{ backgroundImage: `url("${product.image_url}")` }}
                />
                <button
                  onClick={() => removeFromCart(product.product_id)}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors py-1 px-2 rounded hover:bg-red-50"
                  title="Xóa sản phẩm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Xóa
                </button>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                <p className="text-[#333] font-bold text-base line-clamp-2 hover:text-[#1a3c7e] transition-colors cursor-pointer">
                  {product.product_name}
                </p>
              </div>
            </div>

            {/* Cột Đơn giá */}
            <div className="col-span-1 md:col-span-2 text-center">
              <span className="md:hidden text-gray-500 text-sm mr-2">Đơn giá:</span>
              <span className="text-[#333] font-medium">
                {Number(product.price).toLocaleString("vi-VN")}₫
              </span>
            </div>

            {/* Cột Số lượng */}
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <div className="flex items-center border border-gray-300 rounded-lg h-9 bg-white">
                <button
                  onClick={() => decrease(product.product_id)}
                  className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#1a3c7e] rounded-l-lg transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => updateQuantity(product.product_id, parseInt(e.target.value) || 1)}
                  className="w-10 text-center border-none focus:ring-0 text-[#333] font-semibold text-sm p-0"
                />
                <button
                  onClick={() => increase(product.product_id)}
                  className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-[#1a3c7e] rounded-r-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Cột Thành tiền */}
            <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end">
              <span className="md:hidden text-gray-500 text-sm">Thành tiền:</span>
              <div className="flex items-center gap-4">
                <span className="text-[#d32f2f] font-bold text-lg md:text-base">
                  {(product.price * product.quantity).toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </>
  );
}