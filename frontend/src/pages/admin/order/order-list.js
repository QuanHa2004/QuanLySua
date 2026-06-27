import { useEffect, useState } from "react";

const statusMap = {
    pending: { label: "Chờ xử lý", cls: "bg-gray-100 text-gray-600 border-gray-200" },
    processing: { label: "Đang xử lý", cls: "bg-blue-50 text-blue-700 border-blue-100" },
    shipping: { label: "Đang giao", cls: "bg-yellow-50 text-yellow-700 border-yellow-100" },
    delivered: { label: "Đã thanh toán", cls: "bg-green-50 text-green-700 border-green-100" },
    cancelled: { label: "Đã hủy", cls: "bg-red-50 text-red-700 border-red-100" }
};

export default function OrderList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/admin/orders");
                if (!res.ok) throw new Error();
                const json = await res.json();
                setRows(Array.isArray(json.data) ? json.data : []);
            } catch {
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#f8f9fa] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[12%]">Mã đơn</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[20%]">Khách hàng</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[16%]">Ngày đặt</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[14%]">Tổng tiền</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[18%]">Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : rows.length > 0 ? (
                            rows.map(item => {
                                const status = statusMap[item.status] || statusMap.pending;
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
                                            {Number(item.total_amount).toLocaleString("vi-VN")}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${status.cls}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
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