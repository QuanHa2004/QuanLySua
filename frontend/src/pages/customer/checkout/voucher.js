import { useState, useEffect } from "react";

export default function Voucher() {
    const [rows, setRows] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const token = localStorage.getItem("access_token");

                const res = await fetch("http://localhost:8080/promotions", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Không thể tải voucher");
                }

                const json = await res.json();

                setRows(Array.isArray(json.data) ? json.data : []);
            } catch (err) {
                setRows([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <p className="text-sm text-gray-500">Đang tải voucher...</p>;
    }

    if (!rows.length) {
        return <p className="text-sm text-gray-500 italic">Không có voucher khả dụng</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rows.map((voucher) => {
                const isPercent = voucher.discount_type === "percent";
                const isSelected = selectedVoucher?.promo_id === voucher.promo_id;

                return (
                    <label
                        key={voucher.promo_id}
                        className={`group relative flex flex-row rounded-xl border cursor-pointer transition-all duration-200 overflow-hidden
              ${isSelected
                                ? "border-[#1a3c7e] bg-blue-50/30 shadow-sm"
                                : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-md"
                            }`}
                    >
                        <div className={`w-28 flex flex-col items-center justify-center p-2 border-r border-dashed relative
               ${isSelected ? "bg-blue-100/20 border-blue-200" : "bg-gray-50 border-gray-200"}`}>

                            <div className="w-3 h-3 bg-[#f8f9fa] rounded-full absolute -top-1.5 -right-1.5 border-b border-l border-gray-200 z-10"></div>
                            <div className="w-3 h-3 bg-[#f8f9fa] rounded-full absolute -bottom-1.5 -right-1.5 border-t border-l border-gray-200 z-10"></div>

                            <span className="text-[#1a3c7e] font-black text-2xl">
                                {isPercent ? `${parseInt(voucher.discount_value)}%` : `${Number(voucher.discount_value) / 1000}k`}
                            </span>
                            <span className="text-[#1a3c7e] text-xs font-bold uppercase tracking-wider mt-1">Giảm</span>
                        </div>

                        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-blue-50 text-[#1a3c7e] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-blue-100">
                                    {voucher.promo_code}
                                </div>

                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200
                     ${isSelected ? "border-[#1a3c7e] bg-[#1a3c7e]" : "border-gray-300 bg-white group-hover:border-[#1a3c7e]"}`}>
                                    <div className={`w-2 h-2 bg-white rounded-full transition-transform duration-200 ${isSelected ? "scale-100" : "scale-0"}`}></div>
                                </div>

                                <input
                                    type="radio"
                                    checked={isSelected}
                                    onChange={() => setSelectedVoucher(voucher)}
                                    className="hidden"
                                />
                            </div>

                            <p className="text-[#333] font-bold text-sm mb-1 line-clamp-1" title={voucher.description}>
                                {voucher.description}
                            </p>

                            <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-gray-100 border-dashed">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Đơn tối thiểu:</span>
                                    <span className="font-medium text-[#333]">{Number(voucher.min_order_value).toLocaleString()}₫</span>
                                </div>

                                {voucher.max_discount_value && (
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Giảm tối đa:</span>
                                        <span className="font-medium text-[#333]">{Number(voucher.max_discount_value).toLocaleString()}₫</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                                    <span>HSD:</span>
                                    <span>{new Date(voucher.end_date).toLocaleDateString("vi-VN")}</span>
                                </div>
                            </div>
                        </div>
                    </label>
                );
            })}
        </div>
    );
}
