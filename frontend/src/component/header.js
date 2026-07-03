import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../context/cart-context";
import Chatbot from "./chatbot.js";

export default function Header() {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { cartItems, logOut, updateToken } = useCart();

  // ================= STATE CHO NOTIFICATION =================
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotiOpen, setIsNotiOpen] = useState(false);

  const token = localStorage.getItem("access_token");

  // Tổng số lượng sản phẩm trong giỏ
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 1. Lấy thông tin người dùng khi load trang
  useEffect(() => {
    if (token) {
      fetch("http://localhost:8080/current_user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setCurrentUser(data);
          // Tải danh sách thông báo lịch sử sau khi có thông tin User
          if (data.user_id) {
            fetchNotifications(data.user_id);
            setupSseConnection(data.user_id);
          }
        })
        .catch((err) => console.error("Lỗi tải user:", err));
    }
  }, [token]);

  // 2. Hàm fetch danh sách thông báo cũ từ Database
  const fetchNotifications = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8080/notifications/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error("Lỗi tải thông tin thông báo lịch sử:", err);
    }
  };

  // 3. Hàm thiết lập kết nối lắng nghe thời gian thực qua SSE
  const setupSseConnection = (userId) => {
    // Nếu là Admin, có thể truyền một code cố định hoặc ID của Admin
    const eventSource = new EventSource(`http://localhost:8080/notifications/subscribe/${userId}`);

    eventSource.addEventListener("NOTIFICATION_EVENT", (event) => {
      const newNoti = JSON.parse(event.data);
      
      // Đẩy thông báo mới lên đầu danh sách (Real-time Update UI)
      setNotifications(prev => [newNoti, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Hiệu ứng âm thanh nhỏ hoặc rung nhẹ nếu muốn kích thích trải nghiệm người dùng
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  };

  // 4. Hàm xử lý khi nhấn Đọc thông báo
  const handleMarkAsRead = async (notiId) => {
    // Tối ưu UI trước (Optimistic UI Update)
    setNotifications(prev => prev.map(n => n.id === notiId ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await fetch(`http://localhost:8080/notifications/${notiId}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Không thể cập nhật trạng thái đã đọc:", err);
    }
  };

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = () => {
    if (!searchName.trim()) return;
    fetch(`http://localhost:8080/products/search/${searchName}`)
      .then((res) => res.json())
      .then((data) => {
        navigate("/products", {
          state: {
            result: Array.isArray(data.data) ? data.data : [],
          },
        });
      })
      .catch((err) => console.error("Không tìm thấy", err));
  };

  // Xử lý đăng xuất
  const handleLogOut = () => {
    updateToken(null);
    logOut();
    setCurrentUser(null);
    setNotifications([]);
    setUnreadCount(0);
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-100 font-sans transition-all duration-300">
        <div className="container mx-auto px-4 md:px-10 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <h1 className="hidden sm:block text-xl md:text-2xl font-bold tracking-tighter text-[#1a3c7e] uppercase">
              Fresh Milk
            </h1>
          </div>

          {/* Navigation & Search */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              className="text-[#1a3c7e] text-sm font-bold uppercase tracking-wide hover:text-[#4096ff] hover:bg-blue-50 px-4 py-2 rounded-full transition-all duration-300"
              onClick={() => navigate("/")}
            >
              Trang chủ
            </button>

            <button
              className="text-[#1a3c7e] text-sm font-bold uppercase tracking-wide hover:text-[#4096ff] hover:bg-blue-50 px-4 py-2 rounded-full transition-all duration-300"
              onClick={() => navigate("/products")}
            >
              Sản phẩm
            </button>

            {/* Nút Chatbot AI */}
            <button
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide px-4 py-2 rounded-full border border-[#1a3c7e] transition-all duration-300 ${
                isChatOpen 
                ? "bg-[#1a3c7e] text-white" 
                : "text-[#1a3c7e] hover:bg-[#1a3c7e] hover:text-white"
              }`}
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <span className="material-symbols-outlined text-lg">smart_toy</span>
              AI Tư Vấn
            </button>

            {/* Search Bar */}
            <div className="relative group w-48 xl:w-64">
              <div className="flex w-full items-center rounded-full bg-[#f4f7fc] border border-transparent group-focus-within:border-[#1a3c7e] group-focus-within:bg-white group-focus-within:shadow-md transition-all duration-300 h-10 overflow-hidden">
                <input
                  className="w-full bg-transparent border-none outline-none text-sm text-[#333] px-4 placeholder-gray-400"
                  placeholder="Tìm sản phẩm..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center w-10 h-full text-[#1a3c7e] hover:bg-blue-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">search</span>
                </button>
              </div>
            </div>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            
            {/* ================= ICON NOTIFICATION DROP DOWN ================= */}
            {currentUser?.user_id && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotiOpen(!isNotiOpen);
                    setIsChatOpen(false); // Đóng chéo các thành phần khác cho đỡ vướng UI
                  }}
                  className="relative p-2 text-[#1a3c7e] hover:bg-blue-50 rounded-full transition-colors group"
                >
                  <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
                    notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm transform translate-x-0.5 -translate-y-0.5">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Khung nội dung thông báo Dropdown */}
                {isNotiOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform transition-all">
                    <div className="p-4 bg-[#1a3c7e] text-white flex justify-between items-center">
                      <span className="font-bold text-sm uppercase tracking-wider">Thông báo mới nhận</span>
                      {unreadCount > 0 && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Chưa đọc: {unreadCount}</span>}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                          <span className="material-symbols-outlined text-4xl block mb-2 text-gray-200">notifications_off</span>
                          Không có thông báo nào
                        </div>
                      ) : (
                        notifications.map((noti) => (
                          <div
                            key={noti.id}
                            onClick={() => handleMarkAsRead(noti.id)}
                            className={`p-4 text-left transition-colors cursor-pointer text-sm ${
                              noti.is_read ? "bg-white hover:bg-gray-50" : "bg-blue-50/50 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <p className={`font-bold ${noti.is_read ? "text-[#333]" : "text-[#1a3c7e]"}`}>{noti.title}</p>
                              {!noti.is_read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>}
                            </div>
                            <p className="text-gray-600 text-xs mt-1 leading-relaxed">{noti.content}</p>
                            <span className="text-[10px] text-gray-400 block mt-2">Just now</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* ================= END NOTIFICATION ================= */}

            {/* User Profile Menu */}
            <div className="relative">
              {currentUser?.full_name ? (
                <div className="relative group/user">
                  <button className="flex items-center gap-2 text-[#1a3c7e] hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all duration-200">
                    <div className="w-8 h-8 rounded-full bg-[#1a3c7e] text-white flex items-center justify-center text-sm font-bold uppercase">
                      {currentUser.full_name.charAt(0)}
                    </div>
                    <span className="hidden md:block font-bold text-sm max-w-[100px] truncate">
                      {currentUser.full_name}
                    </span>
                    <span className="material-symbols-outlined text-lg">expand_more</span>
                  </button>

                  <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 transform translate-y-2 group-hover/user:translate-y-0 z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setIsNotiOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#1a3c7e] flex items-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">person</span>
                        Hồ sơ cá nhân
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogOut}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-[#1a3c7e] font-bold text-sm hover:bg-blue-50 px-4 py-2 rounded-full transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-xl">account_circle</span>
                  <span className="hidden md:inline">Đăng nhập</span>
                </button>
              )}
            </div>

            {/* Cart Icon */}
            <button
              className="relative p-2 text-[#1a3c7e] hover:bg-blue-50 rounded-full transition-colors group"
              onClick={() => {
                navigate("/carts");
                setIsNotiOpen(false);
              }}
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                shopping_bag
              </span>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#d32f2f] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm transform translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button className="lg:hidden p-2 text-[#1a3c7e]">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tích hợp Chatbot component */}
      <Chatbot 
        currentUser={currentUser} 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}