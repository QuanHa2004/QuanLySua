import { useEffect, useState } from "react";

// Hỗ trợ map cả chữ hoa (từ Backend enum trả về) và chữ thường
const statusMap = {
    PENDING: { label: "Chờ xử lý", cls: "bg-gray-100 text-gray-600 border-gray-200" },
    pending: { label: "Chờ xử lý", cls: "bg-gray-100 text-gray-600 border-gray-200" },
    PROCESSING: { label: "Đang xử lý", cls: "bg-blue-50 text-blue-700 border-blue-100" },
    processing: { label: "Đang xử lý", cls: "bg-blue-50 text-blue-700 border-blue-100" },
    SHIPPING: { label: "Đang giao", cls: "bg-yellow-50 text-yellow-700 border-yellow-100" },
    shipping: { label: "Đang giao", cls: "bg-yellow-50 text-yellow-700 border-yellow-100" },
    DELIVERED: { label: "Đã giao hàng", cls: "bg-green-50 text-green-700 border-green-100" },
    delivered: { label: "Đã giao hàng", cls: "bg-green-50 text-green-700 border-green-100" },
    CANCELLED: { label: "Đã hủy", cls: "bg-red-50 text-red-700 border-red-100" },
    cancelled: { label: "Đã hủy", cls: "bg-red-50 text-red-700 border-red-100" }
};

export default function OrderList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State: Dùng chung để khóa nút bấm khi đang gọi API (tránh click đúp)
    const [processingIds, setProcessingIds] = useState(new Set());

    const token = localStorage.getItem("access_token");

    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:8080/admin/orders", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error();
            const json = await res.json();
            setRows(Array.isArray(json.data) ? json.data : []);
        } catch {
            setRows([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // 1. Hàm xử lý duyệt COD (PENDING -> PROCESSING)
    const handleConfirmCod = async (orderId) => {
        if (!window.confirm(`Bạn có chắc chắn muốn duyệt đơn hàng #${orderId} không?`)) return;

        setProcessingIds(prev => new Set(prev).add(orderId));

        try {
            const res = await fetch(`http://localhost:8080/admin/orders/${orderId}/confirm-cod`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Duyệt đơn thành công! Kho đã được trừ.");
                setRows(prevRows => prevRows.map(row => 
                    row.order_id === orderId ? { ...row, status: "PROCESSING" } : row
                ));
            } else {
                alert(data.message || "Có lỗi xảy ra khi duyệt đơn.");
            }
        } catch (error) {
            alert("Lỗi kết nối đến máy chủ.");
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(orderId);
                return next;
            });
        }
    };

    // 2. [MỚI] Hàm xử lý Xuất giao hàng (PROCESSING -> SHIPPING)
    const handleShipOrder = async (orderId) => {
        if (!window.confirm(`Xác nhận xuất kho và đi giao đơn hàng #${orderId}?`)) return;

        setProcessingIds(prev => new Set(prev).add(orderId));

        try {
            const res = await fetch(`http://localhost:8080/admin/orders/${orderId}/ship`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                // Truyền body rỗng vì Backend đã xử lý lấy tọa độ mặc định nếu null
                body: JSON.stringify({}) 
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("Xuất kho thành công! Hệ thống đang tính toán thời gian giao.");
                setRows(prevRows => prevRows.map(row => 
                    row.order_id === orderId ? { ...row, status: "SHIPPING" } : row
                ));
            } else {
                alert(data.message || "Có lỗi xảy ra khi xuất giao hàng.");
            }
        } catch (error) {
            alert("Lỗi kết nối đến máy chủ.");
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(orderId);
                return next;
            });
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#f8f9fa] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[10%]">Mã đơn</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[20%]">Khách hàng</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[16%]">Ngày đặt</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[14%]">Tổng tiền</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[16%]">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[14%] text-center">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : rows.length > 0 ? (
                            rows.map(item => {
                                const status = statusMap[item.status] || statusMap.PENDING;
                                
                                // Kiểm tra các trạng thái để hiển thị nút tương ứng
                                const isPending = item.status === "PENDING" || item.status === "pending";
                                const isProcessingStatus = item.status === "PROCESSING" || item.status === "processing";
                                
                                const isActionLoading = processingIds.has(item.order_id);

                                return (
                                    <tr
                                        key={item.order_id}
                                        className="hover:bg-blue-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-[#1a3c7e]">
                                            #{item.order_id}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#333]">
                                                    {item.full_name}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    {item.phone}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(item.order_date).toLocaleString("vi-VN")}
                                        </td>

                                        <td className="px-6 py-4 font-bold text-[#d32f2f]">
                                            {Number(item.total_amount).toLocaleString("vi-VN")} đ
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${status.cls}`}>
                                                {status.label}
                                            </span>
                                        </td>

                                        {/* Cột thao tác */}
                                        <td className="px-6 py-4 text-center">
                                            
                                            {/* Nút DUYỆT COD (Chỉ hiện khi PENDING) */}
                                            {isPending && (
                                                <button
                                                    onClick={() => handleConfirmCod(item.order_id)}
                                                    disabled={isActionLoading}
                                                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                                                >
                                                    {isActionLoading ? "Đang xử lý..." : "Duyệt COD"}
                                                </button>
                                            )}

                                            {/* Nút GIAO HÀNG (Chỉ hiện khi PROCESSING) */}
                                            {isProcessingStatus && (
                                                <button
                                                    onClick={() => handleShipOrder(item.order_id)}
                                                    disabled={isActionLoading}
                                                    className="px-4 py-2 text-xs font-bold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                                                >
                                                    {isActionLoading ? "Đang xử lý..." : "Giao hàng"}
                                                </button>
                                            )}

                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                    Chưa có đơn hàng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}