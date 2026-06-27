import { useEffect, useState } from "react";

export default function CategoryList() {
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy token đã lưu trong localStorage
                const token = localStorage.getItem("access_token");

                const res = await fetch("http://localhost:8080/admin/categories", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Gửi token lên backend
                    }
                });

                // Xử lý riêng trường hợp token hết hạn hoặc không đủ quyền Admin
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Phiên đăng nhập hết hạn hoặc không có quyền truy cập!");
                }

                if (!res.ok) throw new Error("Lỗi kết nối server");

                const data = await res.json();

                if (Array.isArray(data.data)) {
                    setCategoryList(data.data);
                } else {
                    setCategoryList([]);
                }
            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error.message);
                setCategoryList([]);
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
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase tracking-wider w-1/2">
                                Tên danh mục
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="2" className="px-6 py-8 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : categoryList.length > 0 ? (
                            categoryList.map((category, index) => (
                                <tr
                                    key={index}
                                    className="group hover:bg-blue-50/30 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-[#333] group-hover:text-[#1a3c7e] transition-colors">
                                                {category.category_name}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <p className="text-sm font-medium">Chưa có danh mục nào.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}