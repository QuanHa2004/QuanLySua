import { useEffect, useState } from "react";

export default function ManufacturerList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/admin/manufacturers");
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
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[30%]">Nhà sản xuất</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[30%]">Liên hệ</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[40%]">Địa chỉ</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : rows.length > 0 ? (
                            rows.map(item => (
                                <tr
                                    key={item.manufacturer_id}
                                    className="hover:bg-blue-50/30 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#333]">
                                                {item.manufacturer_name}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-sm">
                                            <span className="text-[#1a3c7e] font-bold">
                                                {item.phone || "--"}
                                            </span>
                                            <span
                                                className="text-gray-500 truncate max-w-[220px]"
                                                title={item.email}
                                            >
                                                {item.email || "--"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p
                                            className="text-sm text-gray-600 line-clamp-2"
                                            title={item.address}
                                        >
                                            {item.address || "--"}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-12 text-center text-gray-400">
                                    Chưa có nhà sản xuất nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}