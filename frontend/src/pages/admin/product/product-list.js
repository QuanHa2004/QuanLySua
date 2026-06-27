import { useEffect, useState } from "react";

export default function ProductList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const token = localStorage.getItem("access_token");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/admin/products", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
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

    const flatRows = rows.flatMap(product =>
        (product.variants || []).flatMap(variant =>
            (variant.batches && variant.batches.length > 0
                ? variant.batches
                : [{ expiration_date: null, quantity: variant.stock_quantity }]
            ).map(batch => ({
                product_id: product.product_id,
                product_name: product.product_name,
                is_hot: product.is_hot,
                is_deleted: product.is_deleted,
                variant_name: variant.variant_name,
                price: variant.price,
                quantity: batch.quantity,
                expiration_date: batch.expiration_date
            }))
        )
    );

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#f8f9fa] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[22%]">Sản phẩm</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[22%]">Biến thể</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[12%]">Giá</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[10%]">Số lượng</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[12%]">Trạng thái</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[8%]">Hot</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[14%]">HSD</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : flatRows.length > 0 ? (
                            flatRows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-[#333]">
                                        {row.product_name}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600">
                                        {row.variant_name}
                                    </td>

                                    <td className="px-6 py-4 font-bold text-[#d32f2f]">
                                        {Number(row.price).toLocaleString("vi-VN")}
                                    </td>

                                    <td className={`px-6 py-4 font-bold ${row.quantity > 0 ? "text-gray-700" : "text-red-500"}`}>
                                        {row.quantity}
                                    </td>

                                    <td className="px-6 py-4">
                                        {row.is_deleted ? (
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                                                Đã ẩn
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-50 text-green-700 border border-green-100">
                                                Hiển thị
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4">
                                        {row.is_hot && (
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-50 text-red-600 border border-red-100">
                                                HOT
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                        {row.expiration_date || "--"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                    Chưa có sản phẩm
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}