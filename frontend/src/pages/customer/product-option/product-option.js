import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useCart from '../../../context/cart-context';

// --- ICONS ---
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
);
const ChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
);

export default function ProductOption() {
  const { category_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  // --- STATE DỮ LIỆU ---
  const [categoriesList, setCategoryList] = useState([]);
  const [products, setProducts] = useState([]);

  // --- STATE GIAO DIỆN ---
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const searchResult = location.state?.result || null;

  // --- FETCH DATA ---
  useEffect(() => {
    fetch("http://localhost:8080/customer/categories")
      .then(res => res.json())
      .then(data => setCategoryList(Array.isArray(data.data) ? data.data : []));
  }, []);


  useEffect(() => {
    if (searchResult && !category_id) {
      setProducts(searchResult);
      return;
    }

    const fetchFilteredProducts = async () => {
      try {
        const payload = {
          category_id: category_id ? parseInt(category_id) : null
        };

        const res = await fetch("http://localhost:8080/customer/products/filter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) { setProducts([]); return; }
        const data = await res.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Lỗi lọc sản phẩm:", error);
        setProducts([]);
      }
    };
    fetchFilteredProducts();
  }, [category_id, searchResult]);

  // --- HANDLERS ---
  const handleClick = (product) => {
    // 1. Tạo đường dẫn gốc
    let targetUrl = `/product-details/${product.product_id}`;

    // 2. Tạo đối tượng chứa tham số
    const params = new URLSearchParams();


    // 4. Nếu có params thì nối vào URL
    const queryString = params.toString();
    if (queryString) {
      targetUrl += `?${queryString}`;
    }

    navigate(targetUrl);
  };

  const clickCategory = (id) => {
    if (id === "all") navigate("/products");
    else navigate(`/categories/${id}/products`);
  };

  const handleAddToCart = async (e, productItem) => {
    e.stopPropagation();

    if (!productItem.quantity || productItem.quantity <= 0) {
      alert("Sản phẩm tạm hết hàng!");
      return;
    }

    try {
      await addToCart(
        {
          product_id: productItem.product_id,
          product_name: productItem.product_name,
          price: productItem.price,
          image_url: productItem.image_url
        },
        1
      );
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  return (
    <>
      <div className="fixed top-20 left-0 w-full z-40 bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 space-x-2 md:space-x-8 overflow-x-auto no-scrollbar">
            <button onClick={() => clickCategory("all")} className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border border-transparent hover:shadow-md ${!category_id ? "bg-[#1a3c7e] text-white" : "text-[#1a3c7e] hover:bg-[#1a3c7e] hover:text-white"}`}>Tất cả</button>
            {categoriesList.map((cat) => (
              <button key={cat.category_id} onClick={() => clickCategory(cat.category_id)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${String(category_id) === String(cat.category_id) ? "text-[#1a3c7e] bg-blue-50 border border-blue-100" : "text-gray-600 hover:text-[#1a3c7e] hover:bg-blue-50"}`}>{cat.category_name}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-[#f8f9fa] pt-12 px-4 md:px-10 lg:px-20 pb-8">
        <div className="flex flex-col md:flex-row gap-8">

          <div className="w-full md:w-64 flex-shrink-0 space-y-6">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100" onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
                <h3 className="font-bold text-[#1a3c7e]">Danh mục</h3>
                {isCategoryOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
              {isCategoryOpen && (
                <div className="p-4">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <input type="checkbox" id="cat-all" checked={!category_id} onChange={() => clickCategory("all")} className="w-4 h-4 text-[#1a3c7e] border-gray-300 rounded focus:ring-[#1a3c7e] cursor-pointer" />
                      <label htmlFor="cat-all" className="ml-2 text-sm text-gray-600 cursor-pointer hover:text-[#1a3c7e]">Tất cả sản phẩm</label>
                    </li>
                    {categoriesList.map((cat) => (
                      <li key={cat.category_id} className="flex items-center">
                        <input type="checkbox" id={`cat-${cat.category_id}`} checked={String(category_id) === String(cat.category_id)} onChange={() => String(category_id) === String(cat.category_id) ? clickCategory("all") : clickCategory(cat.category_id)} className="w-4 h-4 text-[#1a3c7e] border-gray-300 rounded focus:ring-[#1a3c7e] cursor-pointer" />
                        <label htmlFor={`cat-${cat.category_id}`} className="ml-2 text-sm text-gray-600 cursor-pointer hover:text-[#1a3c7e]">{cat.category_name}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>


          <div className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter((product) => product.quantity > 0).map((product) => (
                  <div key={product.product_id} className="group flex flex-col bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-blue-100 h-full relative" onClick={() => handleClick(product)}>
                    {/* Hình ảnh */}
                    <div className="relative pt-[100%] overflow-hidden p-4">
                      <div className="absolute inset-0 m-4 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${product.image_url}")` }}></div>
                    </div>

                    {/* Nội dung */}
                    <div className="flex flex-col flex-grow p-4">
                      <div className="text-xs font-semibold text-gray-400 uppercase mb-1">{product.category_name}</div>
                      <h3 className="text-[#1a3c7e] text-base md:text-lg font-bold line-clamp-2 mb-2 group-hover:text-[#4096ff] transition-colors">{product.product_name}</h3>


                      {/* Giá & Nút giỏ hàng */}
                      <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-3">
                        <div className="text-red-600 font-bold text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</div>

                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="w-8 h-8 rounded-full bg-blue-50 text-[#1a3c7e] flex items-center justify-center hover:bg-[#1a3c7e] hover:text-white transition-all shadow-sm"
                          title="Thêm vào giỏ"
                        >
                          <CartIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                <div className="text-[#1a3c7e] font-medium text-lg">Chưa có sản phẩm nào</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}