import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../../component/side-bar";

// 1. Định nghĩa dữ liệu map giữa Dung tích và Quy cách đóng gói
const volumeOptions = {
    "180ml": ["Thùng", "Lốc"],
    "110ml": ["Thùng", "Lốc"],
    "200ml": ["Thùng", "Lốc"],
    "65ml":  ["Thùng", "Lốc"], 
    "80ml":  ["Thùng", "Lốc"], 
    "130ml": ["Thùng", "Lốc"], 
    "100g":  ["Thùng", "Lốc"], 
    "380g":  ["Thùng", "Lon"] 
};

export default function AddVariant() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [products, setProducts] = useState([]);
    
    // State lưu thông báo lỗi
    const [error, setError] = useState(""); 

    const [variantData, setVariantData] = useState({
        product_id: "",
        variant_name: "",
        brand_name: "Vinamilk",
        volume: "",
        packaging_type: "",
        price: "",
        stock_quantity: 0 
    });

    const inputClass = "w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] transition-all duration-200 text-sm";
    const labelClass = "text-[#1a3c7e] text-sm font-bold mb-1.5 block uppercase tracking-wide";

    const fetchList = useCallback(async (url, setter) => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            setter(data.data || []);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            setter([]);
        }
    }, []);

    useEffect(() => {
        fetchList("http://localhost:8080/admin/products", setProducts);
    }, [fetchList]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (error) setError("");

        if (name === "volume") {
            setVariantData(prev => ({ 
                ...prev, 
                [name]: value,
                packaging_type: "" 
            }));
        } else {
            setVariantData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(""); 

        try {
            const res = await fetch("http://localhost:8080/admin/variants/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(variantData)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Thêm biến thể thành công!");
                navigate("/admin/product"); 
            } else {
                setError(data.message || data.error || "Có lỗi xảy ra, vui lòng thử lại.");
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            setError("Lỗi kết nối đến máy chủ. Vui lòng kiểm tra mạng.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen bg-[#f8f9fa] font-sans">
            <div className="ml-64 w-full">
                <div className="fixed inset-y-0 left-0 z-50 w-64">
                    <SideBar />
                </div>

                <main className="p-8 w-full max-w-5xl mx-auto">
                    <div className="flex flex-col gap-1 mb-6">
                        <p className="text-[#1a3c7e] text-3xl font-black tracking-tight uppercase">Thêm biến thể mới</p>
                        <p className="text-gray-500 text-sm">Tạo các phiên bản khác nhau (dung tích, bao bì) cho sản phẩm.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 animate-fade-in-down shadow-sm">
                            <div>
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 flex items-center gap-2 uppercase tracking-wide">
                                <span className="p-2 rounded-lg bg-blue-50 text-[#1a3c7e]">
                                    <span className="material-symbols-outlined text-lg">dns</span>
                                </span>
                                Thông tin định danh
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="md:col-span-2">
                                    <span className={labelClass}>Chọn sản phẩm gốc <span className="text-red-500">*</span></span>
                                    <select 
                                        name="product_id" 
                                        value={variantData.product_id} 
                                        onChange={handleChange} 
                                        className={inputClass} 
                                        required
                                    >
                                        <option value="" disabled>-- Chọn sản phẩm --</option>
                                        {products.map(p => (
                                            <option key={p.product_id} value={p.product_id}>
                                                {p.product_name}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    <span className={labelClass}>Tên biến thể <span className="text-red-500">*</span></span>
                                    <input 
                                        name="variant_name" 
                                        value={variantData.variant_name} 
                                        onChange={handleChange} 
                                        placeholder="VD: Lốc 4 hộp 180ml"
                                        className={inputClass} 
                                        required 
                                    />
                                </label>

                                <label>
                                    <span className={labelClass}>Thương hiệu</span>
                                    <input 
                                        name="brand_name" 
                                        value={variantData.brand_name} 
                                        onChange={handleChange} 
                                        className={inputClass} 
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 flex items-center gap-2 uppercase tracking-wide">
                                <span className="p-2 rounded-lg bg-blue-50 text-[#1a3c7e]">
                                    <span className="material-symbols-outlined text-lg">water_drop</span>
                                </span>
                                Đặc điểm
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label>
                                    <span className={labelClass}>Dung tích (Volume) <span className="text-red-500">*</span></span>
                                    <select 
                                        name="volume" 
                                        value={variantData.volume} 
                                        onChange={handleChange} 
                                        className={inputClass}
                                        required
                                    >
                                        <option value="">-- Chọn dung tích --</option>
                                        {Object.keys(volumeOptions).map((vol) => (
                                            <option key={vol} value={vol}>{vol}</option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    <span className={labelClass}>Loại bao bì <span className="text-red-500">*</span></span>
                                    <select 
                                        name="packaging_type" 
                                        value={variantData.packaging_type} 
                                        onChange={handleChange} 
                                        className={`${inputClass} ${!variantData.volume ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        required
                                        disabled={!variantData.volume}
                                    >
                                        <option value="">-- Chọn quy cách --</option>
                                        {variantData.volume && volumeOptions[variantData.volume]?.map((pack) => (
                                            <option key={pack} value={pack}>{pack}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 flex items-center gap-2 uppercase tracking-wide">
                                <span className="p-2 rounded-lg bg-blue-50 text-[#1a3c7e]">
                                    <span className="material-symbols-outlined text-lg">payments</span>
                                </span>
                                Giá
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label>
                                    <span className={labelClass}>Giá bán (VNĐ) <span className="text-red-500">*</span></span>
                                    <input 
                                        type="number" 
                                        name="price" 
                                        value={variantData.price} 
                                        onChange={handleChange} 
                                        className={`${inputClass} font-bold text-[#1a3c7e]`} 
                                        placeholder="0"
                                        required 
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 pb-8">
                            <button 
                                type="button" 
                                onClick={() => navigate(-1)} 
                                className="h-11 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Quay lại
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="h-11 px-8 rounded-xl bg-[#1a3c7e] text-white font-bold shadow-lg shadow-blue-100 hover:bg-[#15326d] transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? "Đang xử lý..." : "Xác nhận thêm"}
                            </button>
                        </div>

                    </form>
                </main>
            </div>
        </div>
    );
}