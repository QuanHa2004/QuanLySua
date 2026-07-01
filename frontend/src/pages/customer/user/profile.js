import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../../../component/footer';
import Header from '../../../component/header';

export default function Profile() {
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    // State quản lý tab, chế độ edit, user và đơn hàng
    const [tab, setTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [backupUser, setBackupUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        avatar_url: "",
    });


    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Hàm lấy thông tin người dùng hiện tại
    const fetchUser = async () => {
        try {
            const res = await fetch("http://localhost:8080/current_user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                navigate("/login");
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error(err);
        }
    };

    // Hàm lấy lịch sử mua hàng
    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:8080/customer/orders/history", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.log("Không thể tải lịch sử mua hàng");
                return;
            }

            const data = await res.json();
            setOrders(Array.isArray(data.data) ? data.data : []);
        } catch (err) {
            console.error(err);
            setOrders([]);
        }
    };


    // Hàm cập nhật thông tin người dùng
    const handleUpdateUser = async () => {
        try {
            const res = await fetch("http://localhost:8080/users/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(user),
            });

            if (!res.ok) {
                alert("Cập nhật không thành công!");
                return;
            }

            const data = await res.json();

            if (res.status === 200 && data.message === "Updated successfully") {
                console.log("Cập nhật thông tin thành công!")
                alert("Cập nhật thông tin thành công!");
            }

            if (res.status === 200 && data.message === "No changes detected") {
                console.log("Không có thay đổi")
                alert("Không có thay đổi");
            }


            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Lỗi hệ thống!");
        }
    };

    const fetchOrderDetail = async (orderId) => {
        try {
            const res = await fetch(`http://localhost:8080/customer/orders/${orderId}/details`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const json = await res.json();
            if (json.success) {
                setSelectedOrder(json.data);
                setIsDetailModalOpen(true);
            } else {
                alert(json.message);
            }
        } catch (err) {
            console.error(err);
            alert("Không thể tải chi tiết đơn hàng.");
        }
    };

    // Xử lý hủy bỏ chỉnh sửa: quay về dữ liệu cũ
    const handleCancelEdit = () => {
        setUser(backupUser);
        setIsEditing(false);
    };

    // Xử lý bắt đầu chỉnh sửa: lưu backup dữ liệu
    const handleStartEdit = () => {
        setBackupUser(user);
        setIsEditing(true);
    };

    // Effect: Load user khi mount
    useEffect(() => {
        fetchUser();
    }, [navigate, token]);

    // Effect: Load orders khi chuyển tab
    useEffect(() => {
        if (tab === "orders") fetchOrders();
    }, [tab]);

    return (
        <div className="bg-[#f8f9fa] font-sans text-[#333]">
            <div className="relative flex min-h-screen w-full flex-col">
                <Header />

                <main className="flex-grow pt-32 pb-20">
                    <div className="container mx-auto px-4 md:px-10 lg:px-20">

                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-gray-500 cursor-pointer hover:text-[#1a3c7e]" onClick={() => navigate('/')}>Trang chủ</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-[#1a3c7e] font-semibold">Tài khoản</span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <aside className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full border-4 border-blue-50 overflow-hidden mb-4">
                                                
                                            </div>
                                            <div className="absolute bottom-4 right-0 bg-[#1a3c7e] p-1.5 rounded-full border-2 border-white cursor-pointer hover:bg-blue-700">
                                                <span className="material-symbols-outlined text-white text-xs">edit</span>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-[#1a3c7e] text-xl">{user.full_name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                                    </div>

                                    <nav className="space-y-2">
                                        <button
                                            onClick={() => setTab("profile")}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 
                                            ${tab === "profile"
                                                    ? "bg-[#1a3c7e] text-white shadow-md shadow-blue-200"
                                                    : "text-gray-600 hover:bg-blue-50 hover:text-[#1a3c7e]"}`}
                                        >
                                            <span className="material-symbols-outlined">person</span>
                                            Thông tin cá nhân
                                        </button>

                                        <button
                                            onClick={() => setTab("orders")}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
                        ${tab === "orders"
                                                    ? "bg-[#1a3c7e] text-white shadow-md shadow-blue-200"
                                                    : "text-gray-600 hover:bg-blue-50 hover:text-[#1a3c7e]"}`}
                                        >
                                            <span className="material-symbols-outlined">shopping_bag</span>
                                            Lịch sử mua hàng
                                        </button>

                                    </nav>
                                </div>
                            </aside>

                            <div className="lg:col-span-3">
                                {tab === "profile" && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                            <h2 className="text-[#1a3c7e] text-2xl font-bold uppercase tracking-wide">Hồ sơ của tôi</h2>
                                            {!isEditing && (
                                                <button
                                                    onClick={handleStartEdit}
                                                    className="text-[#1a3c7e] font-semibold text-sm hover:underline flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit_square</span>
                                                    Chỉnh sửa
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                            <div>
                                                <label className="block text-sm font-bold text-[#1a3c7e] mb-2 uppercase">Họ và tên</label>
                                                <input
                                                    type="text"
                                                    value={user.full_name}
                                                    disabled={!isEditing}
                                                    onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-colors outline-none
                            ${isEditing
                                                            ? "bg-white border-gray-300 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e]"
                                                            : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"}`}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-[#1a3c7e] mb-2 uppercase">Email</label>
                                                <input
                                                    type="email"
                                                    value={user.email}
                                                    disabled
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-[#1a3c7e] mb-2 uppercase">Số điện thoại</label>
                                                <input
                                                    type="text"
                                                    value={user.phone || ""}
                                                    disabled={!isEditing}
                                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-colors outline-none
                            ${isEditing
                                                            ? "bg-white border-gray-300 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e]"
                                                            : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"}`}
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-[#1a3c7e] mb-2 uppercase">Địa chỉ nhận hàng</label>
                                                <input
                                                    type="text"
                                                    value={user.address || ""}
                                                    disabled={!isEditing}
                                                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                                                    className={`w-full px-4 py-3 rounded-lg border transition-colors outline-none
                            ${isEditing
                                                            ? "bg-white border-gray-300 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e]"
                                                            : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"}`}
                                                />
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                                >
                                                    Hủy bỏ
                                                </button>
                                                <button
                                                    onClick={handleUpdateUser}
                                                    className="px-8 py-2.5 rounded-lg font-bold text-white bg-[#1a3c7e] hover:bg-[#15326d] shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
                                                >
                                                    Lưu thay đổi
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {tab === "orders" && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                                        <h2 className="text-[#1a3c7e] text-2xl font-bold uppercase tracking-wide mb-8 border-b border-gray-100 pb-4">
                                            Lịch sử đơn hàng
                                        </h2>

                                        {orders.length === 0 ? (
                                            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">receipt_long</span>
                                                <p className="text-gray-500 font-medium mb-4">Bạn chưa có đơn hàng nào.</p>
                                                <button onClick={() => navigate('/products')} className="text-[#1a3c7e] font-bold hover:underline">
                                                    Mua sắm ngay
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {orders.map((order) => (
                                                    <div
                                                        key={order.order_id}
                                                        className="group border border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200 bg-white"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1a3c7e]">
                                                                    <span className="material-symbols-outlined">inventory_2</span>
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="font-bold text-[#1a3c7e] text-lg">#{order.order_id}</span>
                                                                        <span className="text-gray-400 text-xs">|</span>
                                                                        <span className="text-gray-500 text-sm">{order.order_date}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border
                                                ${order.status === 'Đã giao' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                                order.status === 'Đang xử lý' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                                                    order.status === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                                        'bg-gray-50 text-gray-600 border-gray-100'}`}
                                                                        >
                                                                            {order.status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pl-16 md:pl-0">
                                                                <div className="text-right">
                                                                    <p className="text-xs text-gray-500 uppercase font-bold">Tổng tiền</p>
                                                                    <p className="text-[#d32f2f] font-bold text-lg">{Number(order.total_amount).toLocaleString()}₫</p>
                                                                </div>
                                                                <button onClick={() => fetchOrderDetail(order.order_id)}
                                                                    className="px-4 py-2 rounded-lg border border-[#1a3c7e] text-[#1a3c7e] font-bold text-sm hover:bg-[#1a3c7e] hover:text-white transition-all whitespace-nowrap">
                                                                    Chi tiết
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />

                {isDetailModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h3 className="text-xl font-bold text-[#1a3c7e]">Đơn hàng #{selectedOrder.order_id}</h3>
                                <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-red-500">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <p><strong>Ngày đặt:</strong> {selectedOrder.order_date}</p>
                                <p><strong>Trạng thái:</strong> <span className="text-blue-600 font-bold">{selectedOrder.status}</span></p>
                                <p><strong>Địa chỉ:</strong> {selectedOrder.delivery_address}</p>
                            </div>

                            <table className="w-full text-left mb-6">
                                <thead>
                                    <tr className="text-gray-500 text-sm border-b">
                                        <th className="pb-2">Sản phẩm</th>
                                        <th className="pb-2 text-center">SL</th>
                                        <th className="pb-2 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {selectedOrder.items.map((item, idx) => (
                                        <tr key={idx} className="py-4">
                                            <td className="py-3">{item.product_name}</td>
                                            <td className="py-3 text-center">{item.quantity}</td>
                                            <td className="py-3 text-right">{Number(item.total_item_amount).toLocaleString()}₫</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="text-right border-t pt-4">
                                <p className="text-lg font-bold text-red-600">Tổng thanh toán: {Number(selectedOrder.total_amount).toLocaleString()}₫</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}