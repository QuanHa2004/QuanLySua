import { useEffect, useState } from "react";

export default function UserList() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/admin/users");
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

    const openConfirm = (user) => {
        setSelectedUser(user);
        setConfirmOpen(true);
    };

    const confirmToggle = async () => {
        if (!selectedUser) return;

        const newStatus = selectedUser.is_deleted === 0 ? 1 : 0;

        try {
            const res = await fetch("http://localhost:8080/admin/users/status", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: selectedUser.user_id,
                    is_deleted: newStatus
                })
            });

            const json = await res.json();
            if (!res.ok || !json.success) throw new Error();

            setRows(prev =>
                prev.map(u =>
                    u.user_id === selectedUser.user_id
                        ? { ...u, is_deleted: newStatus }
                        : u
                )
            );
        } catch {
            alert("Không thể cập nhật trạng thái người dùng");
        } finally {
            setConfirmOpen(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm font-sans">
            <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left">
                    <thead className="bg-[#f4f7fc] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[25%]">Họ và tên</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[20%]">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">SĐT</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">Địa chỉ</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#1a3c7e] uppercase w-[15%]">Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        )}

                        {!isLoading && rows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Không có người dùng nào
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            rows.map((user) => (
                                <tr
                                    key={user.user_id}
                                    className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                                    onClick={() => openConfirm(user)}
                                >
                                    <td className="px-6 py-4 font-bold text-[#333]">
                                        {user.full_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 truncate">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.phone || "—"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 truncate">
                                        {user.address || "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.is_deleted === 0 ? (
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-50 text-green-700 border border-green-100">
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-50 text-red-700 border border-red-100">
                                                Đã khóa
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[360px] shadow-xl">
                        <h3 className="text-lg font-bold text-[#1a3c7e] mb-4">
                            Xác nhận thay đổi
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Bạn có chắc muốn {selectedUser?.is_deleted === 0 ? "khóa" : "mở khóa"} người dùng này?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmToggle}
                                className={`px-4 py-2 rounded-lg text-white font-bold transition-colors
                                    ${selectedUser?.is_deleted === 0 ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                                `}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}