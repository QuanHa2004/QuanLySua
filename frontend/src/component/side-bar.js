import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useCart from "../context/cart-context";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState({});
  const { logOut, updateToken } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      fetch("http://localhost:8080/current_user", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => setCurrentUser(data))
        .catch((err) => console.error("Lỗi:", err));
    }
  }, []);

  console.log(currentUser);

  const handleLogOut = () => {
    updateToken(null);
    logOut();
    setCurrentUser("Đăng nhập");
    navigate("/login", { replace: true });
  };

  const icons = {
    dashboard: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
    order: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    ),
    category: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    ),
    product: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    manufacturer: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
        <line x1="17" y1="13" x2="17" y2="13"></line>
        <line x1="7" y1="13" x2="7" y2="13"></line>
      </svg>
    ),
    supplier: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
    promotion: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
      </svg>
    ),
    invoice: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>
    ),
    logout: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    ),
    store: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    review: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    )
  };

  const navItems = [
    { icon: icons.dashboard, text: "Bảng điều khiển", url: "/admin/dashboard" },
    { icon: icons.order, text: "Đơn hàng", url: "/admin/order" },
    { icon: icons.category, text: "Danh mục", url: "/admin/category" },
    { icon: icons.product, text: "Sản phẩm", url: "/admin/product" },
    { icon: icons.user, text: "Người dùng", url: "/admin/user" },
    { icon: icons.manufacturer, text: "Nhà sản xuất", url: "/admin/manufacturer" },
    { icon: icons.supplier, text: "Nhà cung cấp", url: "/admin/supplier" },
    { icon: icons.promotion, text: "Mã giảm giá", url: "/admin/promotion" },
    { icon: icons.invoice, text: "Nhập hàng", url: "/admin/invoice" },
    { icon: icons.review, text: "Đánh giá", url: "/admin/review" },
  ];

  const isActive = (url) => {
    if (url === "/admin/dashboard" && location.pathname === "/admin/dashboard") return true;
    return location.pathname.startsWith(url) && url !== "/admin/dashboard";
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm">

      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-3 text-[#1a3c7e]">
          <div className="p-2 bg-blue-50 text-[#1a3c7e] rounded-xl">
            {icons.store}
          </div>
          <h1 className="text-xl font-black tracking-tight text-[#1a3c7e]">
            FreshMilk
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.url);
          return (
            <button
              key={item.text}
              onClick={() => navigate(item.url)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group relative
                ${active
                  ? "bg-[#1a3c7e] text-white shadow-lg shadow-blue-100"
                  : "text-gray-500 hover:bg-blue-50 hover:text-[#1a3c7e]"
                }
              `}
            >
              <span className={`transition-transform duration-200 ${active ? "text-white" : "text-gray-400 group-hover:text-[#1a3c7e] group-hover:scale-110"}`}>
                {item.icon}
              </span>

              <span>{item.text}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#1a3c7e] flex items-center justify-center text-white font-bold text-lg">
           Q
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1a3c7e] truncate">
              {currentUser.full_name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser.email}
            </p>
          </div>

          <button
            onClick={handleLogOut}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors p-2 rounded-lg"
            title="Đăng xuất"
          >
            {icons.logout}
          </button>
        </div>
      </div>
    </aside>
  );
}