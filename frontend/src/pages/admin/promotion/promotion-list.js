import { useEffect, useState } from "react";

export default function PromotionList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/admin/promotions");
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

    const openConfirm = (promotion) => {
        setSelectedPromo(promotion);
        setConfirmOpen(true);
    };

    const confirmToggle = async () => {
        if (!selectedPromo) return;
        const newStatus = selectedPromo.is_active ? 0 : 1;
        try {
            const res = await fetch("http://localhost:8080/admin/promotions/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promo_id: selectedPromo.promo_id, is_active: newStatus })
            });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || "Cập nhật thất bại");
            setRows(prev => prev.map(p => p.promo_id === selectedPromo.promo_id ? { ...p, is_active: newStatus } : p));
        } catch (err) {
            alert("Không thể cập nhật trạng thái mã giảm giá");
        } finally {
            setConfirmOpen(false);
            setSelectedPromo(null);
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#f8f9fa] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[20%]">Mã giảm giá</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">Giá trị giảm</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">Đơn tối thiểu</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[20%]">Thời hạn</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading && <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>}
                        {!isLoading && rows.length === 0 && <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">Chưa có chương trình khuyến mãi nào.</td></tr>}

                        {!isLoading && rows.map((promotion) => (
                            <tr key={promotion.promo_id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="font-mono text-sm font-bold text-[#1a3c7e] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 select-all">
                                        {promotion.promo_code}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {promotion.discount_type === "percent" ? (
                                        <div className="text-sm font-bold text-[#333]">
                                            {Number(promotion.discount_value)}%
                                            <span className="ml-1 text-xs text-gray-400 font-normal">(tối đa {Number(promotion.max_discount_value).toLocaleString("vi-VN")})</span>
                                        </div>
                                    ) : (
                                        <div className="text-sm font-bold text-[#333]">{Number(promotion.discount_value).toLocaleString("vi-VN")}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-[#333]">
                                    {Number(promotion.min_order_value).toLocaleString("vi-VN")}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    <div>BĐ: {new Date(promotion.start_date).toLocaleDateString("vi-VN")}</div>
                                    <div className="font-bold text-[#1a3c7e]">KT: {new Date(promotion.end_date).toLocaleDateString("vi-VN")}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openConfirm(promotion)}
                                        className={`px-3 py-1 text-xs font-bold rounded-full border transition ${promotion.is_active ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}
                                    >
                                        {promotion.is_active ? "Hoạt động" : "Đã ngưng"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {confirmOpen && selectedPromo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl w-[420px] shadow-xl p-6">
                        <h3 className="text-lg font-bold text-[#1a3c7e]">Xác nhận thay đổi trạng thái</h3>
                        <p className="mt-3 text-sm text-gray-600">
                            Bạn có chắc chắn muốn <span className="font-bold">{selectedPromo.is_active ? "ngưng" : "kích hoạt"}</span> mã giảm giá <span className="font-mono font-bold text-[#1a3c7e]">{selectedPromo.promo_code}</span>?
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">Hủy</button>
                            <button onClick={confirmToggle} className={`px-4 py-2 rounded-lg text-white font-bold ${selectedPromo.is_active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}