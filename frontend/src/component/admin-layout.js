import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./side-bar"; // Đường dẫn đến file SideBar của bạn

export default function AdminLayout() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  
  const token = localStorage.getItem("access_token");
  
  const adminId = 3; 

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    // 1. Tải danh sách thông báo cũ dành cho Admin
    fetchAdminNotifications();

    // 2. Mở đường ống kết nối Real-time lắng nghe đơn hàng mới
    const eventSource = new EventSource(`http://localhost:8080/notifications/subscribe/${adminId}`);

    eventSource.addEventListener("NOTIFICATION_EVENT", (event) => {
      const newNoti = JSON.parse(event.data);
      
      // Đẩy thông báo đơn hàng mới lên đầu danh sách của Admin
      setNotifications(prev => [newNoti, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [token]);

  const fetchAdminNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:8080/notifications/user/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error("Lỗi tải thông báo Admin:", err);
    }
  };

  const handleMarkAsRead = async (notiId) => {
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

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-[#333]">
      {/* SideBar cố định bên trái */}
      <SideBar />
      
      {/* Khối nội dung bên phải (Bao gồm TopBar + Khu vực hiển thị nội dung chính) */}
      <div className="flex-1 ml-64 flex flex-col">
        
        {/* ================= THÀNH PHẦN TOPBAR MỚI BỔ SUNG ================= */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[#1a3c7e]"></h2>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Khối Icon Quả Chuông Thông Báo */}
            <div className="relative">
              <button
                onClick={() => setIsNotiOpen(!isNotiOpen)}
                className="relative p-2.5 text-gray-500 hover:text-[#1a3c7e] hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              >
                <span className="material-symbols-outlined text-2xl group-hover:animate-swing">
                  notifications
                </span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown thông báo của Admin */}
              {isNotiOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
                  <div className="p-4 bg-[#1a3c7e] text-white flex justify-between items-center">
                    <span className="font-bold text-xs uppercase tracking-wider">Thông báo hệ thống</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] bg-red-500/20 text-red-200 px-2 py-0.5 rounded-full font-bold">
                        Mới: {unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Danh sách thông báo */}
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-gray-200">notifications_off</span>
                        <span>Không có thông báo mới phát sinh</span>
                      </div>
                    ) : (
                      notifications.map((noti) => (
                        <div
                          key={noti.id}
                          onClick={() => {
                            handleMarkAsRead(noti.id);
                            // Mẹo: Nếu là thông báo đơn hàng mới, bấm vào có thể chuyển hướng thẳng sang trang xử lý đơn hàng
                            if (noti.content.includes("đơn hàng")) {
                              navigate("/admin/order");
                              setIsNotiOpen(false);
                            }
                          }}
                          className={`p-4 text-left transition-colors cursor-pointer text-sm flex gap-3 items-start ${
                            noti.is_read ? "bg-white hover:bg-gray-50" : "bg-blue-50/40 hover:bg-blue-50"
                          }`}
                        >
                          {/* Icon biểu thị loại thông báo hệ thống */}
                          <div className={`p-2 rounded-lg shrink-0 ${noti.is_read ? "bg-gray-100 text-gray-400" : "bg-blue-100 text-[#1a3c7e]"}`}>
                            <span className="material-symbols-outlined text-lg block">shopping_cart</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-2">
                              <p className={`font-bold truncate ${noti.is_read ? "text-gray-700" : "text-[#1a3c7e]"}`}>
                                {noti.title}
                              </p>
                              {!noti.is_read && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>}
                            </div>
                            <p className="text-gray-500 text-xs mt-1 leading-relaxed">{noti.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* ================= END TOPBAR ================= */}

        {/* Khối hiển thị Nội dung chính của các trang con */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet /> 
        </main>

      </div>
    </div>
  );
}