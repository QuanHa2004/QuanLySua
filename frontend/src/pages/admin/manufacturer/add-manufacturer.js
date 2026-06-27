import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../../component/side-bar";

export default function AddManufacturer() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        manufacturer_name: "",
        email: "",
        phone: "",
        address: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8080/admin/manufacturers/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Thêm nhà sản xuất thất bại");
            }

            alert(result.message || "Thêm nhà sản xuất thành công");

            setFormData({
                manufacturer_name: "",
                email: "",
                phone: "",
                address: ""
            });

            navigate("/admin/manufacturer");

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="relative flex min-h-screen bg-[#f8f9fa] font-sans">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="ml-64 flex flex-row min-h-screen">
                    <div className="fixed inset-y-0 left-0 z-50 w-64">
                        <SideBar />
                    </div>

                    <main className="flex-1 p-8 w-full">
                        <div className="w-full max-w-4xl mx-auto">

                            <div className="flex flex-col gap-1 mb-8">
                                <p className="text-[#1a3c7e] text-3xl font-black tracking-tight uppercase">
                                    Thêm nhà sản xuất
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Đăng ký thông tin đơn vị sản xuất mới vào hệ thống.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="p-2 rounded-lg bg-blue-50 text-[#1a3c7e]">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><line x1="17" y1="13" x2="17" y2="13"></line><line x1="7" y1="13" x2="7" y2="13"></line></svg>
                                            </span>
                                            Thông tin chung
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <label className="flex flex-col w-full gap-2 md:col-span-2">
                                                <span className="text-[#1a3c7e] text-sm font-bold">Tên nhà sản xuất <span className="text-red-500">*</span></span>
                                                <input
                                                    name="manufacturer_name"
                                                    value={formData.manufacturer_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] transition-all duration-200"
                                                    placeholder="VD: Vinamilk, TH True Milk..."
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="text-[#1a3c7e] text-sm font-bold">Số điện thoại</span>
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] transition-all duration-200"
                                                    placeholder="VD: 1900 6066"
                                                />
                                            </label>

                                            <label className="flex flex-col w-full gap-2">
                                                <span className="text-[#1a3c7e] text-sm font-bold">Email liên hệ</span>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] transition-all duration-200"
                                                    placeholder="company@example.com"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 flex items-center gap-2 uppercase tracking-wide">
                                            <span className="p-2 rounded-lg bg-blue-50 text-[#1a3c7e]">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            </span>
                                            Địa chỉ trụ sở
                                        </h3>

                                        <label className="flex flex-col w-full gap-2">
                                            <span className="text-[#1a3c7e] text-sm font-bold">Địa chỉ chi tiết <span className="text-red-500">*</span></span>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                rows="3"
                                                className="min-h-[100px] py-3 w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] transition-all duration-200 resize-none"
                                                placeholder="VD: Số 10 Tân Trào, P. Tân Phú, Q.7, TP.HCM..."
                                            />
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => navigate(-1)}
                                            className="h-11 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="h-11 px-8 rounded-xl bg-[#1a3c7e] text-white font-bold shadow-lg shadow-blue-100 hover:bg-[#15326d] hover:-translate-y-0.5 disabled:opacity-70 transition-all duration-300 flex items-center gap-2"
                                        >
                                            {isSubmitting ? "Đang lưu..." : "Lưu nhà sản xuất"}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}