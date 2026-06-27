import { useEffect, useState } from "react";

export default function ReviewList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/admin/reviews");
                if (!res.ok) throw new Error("Server error");
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
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm font-sans">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#f4f7fc] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[20%]">Người dùng</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[20%]">Sản phẩm</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">Biến thể</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">Đánh giá</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[20%]">Bình luận</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[10%] text-right">Hành động</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        )}

                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                                    Không có đánh giá nào
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            rows.map((row) => (
                                <tr key={row.review_id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#333]">
                                        {row.full_name}
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">
                                        {row.product_name}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {row.variant_name}
                                    </td>

                                    <td className="px-6 py-4">
                                        <RatingStars value={row.rating || 0} />
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600 line-clamp-2">
                                        {row.comment || "—"}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors">
                                            Ẩn
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function RatingStars({ value }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={star <= value ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-4 h-4 ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}