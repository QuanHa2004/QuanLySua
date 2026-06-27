import { useEffect, useState } from "react";

export default function InvoiceList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/admin/invoices");
                if (!res.ok) throw new Error("Server error");
                const json = await res.json();
                setRows(Array.isArray(json.data) ? json.data : []);
            } catch (e) {
                console.error(e);
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
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">
                                Mã phiếu
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[35%]">
                                Nhà cung cấp
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[25%]">
                                Tổng tiền
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">
                                Ngày nhập
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        )}

                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                    Chưa có phiếu nhập hàng nào.
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            rows.map((invoice) => (
                                <tr
                                    key={invoice.invoice_id}
                                    className="hover:bg-blue-50/30 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm font-bold text-[#1a3c7e] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                            #{invoice.invoice_id}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="font-bold text-[#333]">
                                            {invoice.supplier_name}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm font-bold text-[#d32f2f]">
                                        {Number(invoice.total_amount/100).toLocaleString("vi-VN")}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(invoice.created_at).toLocaleDateString("vi-VN")}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}