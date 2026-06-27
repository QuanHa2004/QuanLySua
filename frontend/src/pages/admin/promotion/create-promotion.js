import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../../component/side-bar";

export default function CreatePromotion() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        promo_code: "",
        description: "",
        discount_type: "percent",
        discount_value: "",
        max_discount_value: "",
        min_order_value: "",
        max_uses: "",       
        start_date: "",
        end_date: "",
        is_active: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        if (!token) {
            alert("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn!");
            navigate("/login");
            return;
        }

        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
            alert("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("http://localhost:8080/admin/promotions/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("Tạo mã giảm giá thành công!");
                navigate("/admin/promotion");
            } else {
                const data = await res.json();
                alert(data.message || "Có lỗi xảy ra!");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối đến server!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] transition-all duration-200 text-sm";
    const labelClass = "text-[#1a3c7e] text-sm font-bold mb-1.5 block uppercase tracking-wide";

    return (
        <div className="relative flex min-h-screen bg-[#f8f9fa] font-sans">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <div className="ml-64 flex flex-row min-h-screen">
                    <div className="fixed inset-y-0 left-0 z-50 w-64">
                        <SideBar />
                    </div>

                    <main className="flex-1 p-8 w-full">
                        <div className="w-full max-w-3xl mx-auto">
                            <div className="flex flex-col gap-1 mb-8">
                                <p className="text-[#1a3c7e] text-3xl font-black tracking-tight uppercase">
                                    Tạo mã giảm giá
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Thiết lập chương trình khuyến mãi cho khách hàng.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="flex flex-col w-full">
                                            <span className={labelClass}>Mã Code <span className="text-red-500">*</span></span>
                                            <input name="promo_code" value={formData.promo_code} onChange={handleChange} required className={`${inputClass} font-mono uppercase font-bold`} placeholder="VD: SALE50" />
                                        </label>

                                        <label className="flex flex-col w-full">
                                            <span className={labelClass}>Loại giảm giá</span>
                                            <select name="discount_type" value={formData.discount_type} onChange={handleChange} className={inputClass}>
                                                <option value="percent">Phần trăm (%)</option>
                                                <option value="fixed">Số tiền cố định (VNĐ)</option>
                                            </select>
                                        </label>

                                        <label className="flex flex-col w-full md:col-span-2">
                                            <span className={labelClass}>Mô tả</span>
                                            <input name="description" value={formData.description} onChange={handleChange} className={inputClass} placeholder="VD: Giảm giá mùa hè..." />
                                        </label>

                                        <label className="flex flex-col w-full">
                                            <span className={labelClass}>Giá trị giảm <span className="text-red-500">*</span></span>
                                            <input type="number" name="discount_value" value={formData.discount_value} onChange={handleChange} required className={inputClass} />
                                        </label>

                                        <label className="flex flex-col w-full">
                                            <span className={labelClass}>Giảm tối đa (Nếu %)</span>
                                            <input type="number" name="max_discount_value" value={formData.max_discount_value} onChange={handleChange} className={inputClass} disabled={formData.discount_type !== 'percent'} />
                                        </label>

                                        <label className="flex flex-col w-full">
                                            <span className={labelClass}>Đơn tối thiểu</span>
                                            <input type="number" name="min_order_value" value={formData.min_order_value} onChange={handleChange} className={inputClass} />
                                        </label>

                                        <label className="flex flex-col w-full">
                                            <span className={labelClass}>Số lượng mã</span>
                                            <input type="number" name="max_uses" value={formData.max_uses} onChange={handleChange} className={inputClass} />
                                        </label>

                                        <label className="flex flex-col w-full">
                                            <span className={labelClass}>Ngày bắt đầu <span className="text-red-500">*</span></span>
                                            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className={inputClass} />
                                        </label>

                                        <label className="flex flex-col w-full">
                                            <span className={labelClass}>Ngày kết thúc <span className="text-red-500">*</span></span>
                                            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className={inputClass} />
                                        </label>

                                        <div className="flex items-center gap-3 mt-2 md:col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 accent-[#1a3c7e] cursor-pointer" />
                                            <label className="text-[#1a3c7e] font-bold select-none cursor-pointer">
                                                Kích hoạt ngay sau khi tạo
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                                        <button type="button" onClick={() => navigate(-1)} className="h-11 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                                            Hủy bỏ
                                        </button>
                                        <button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-xl bg-[#1a3c7e] text-white font-bold shadow-lg shadow-blue-100 hover:bg-[#15326d] hover:-translate-y-0.5 disabled:opacity-70 transition-all duration-300">
                                            {isSubmitting ? "Đang xử lý..." : "Tạo mã giảm giá"}
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