import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartSummary from '../../../component/cart-summary';
import Footer from '../../../component/footer';
import Header from '../../../component/header';
import useCart from '../../../context/cart-context';

export default function Checkout() {
    const navigate = useNavigate();
    const { fetchCartItems } = useCart();
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State quản lý danh sách địa giới hành chính
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [formData, setFormData] = useState({
        paymentMethod: 'COD'
    });

    const [customerInfo, setCustomerInfo] = useState({
        fullName: '',
        phone: ''
    });

    // State quản lý địa chỉ chi tiết theo chuẩn 4 trường
    const [addressState, setAddressState] = useState({
        provinceCode: "",
        provinceName: "",
        districtCode: "",
        districtName: "",
        wardCode: "",
        wardName: "",
        street: ""
    });

    useEffect(() => {
        fetchUser();
        fetchProvinces(); // Tải danh sách Tỉnh/Thành phố ngay khi vào trang
    }, []);

    // Tải danh sách Tỉnh/Thành
    const fetchProvinces = async () => {
        try {
            const res = await fetch("https://provinces.open-api.vn/api/p/");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setProvinces(data);
        } catch (error) {
            console.error("Lỗi tải danh sách Tỉnh/Thành:", error);
        }
    };

    // Tải danh sách Quận/Huyện khi Tỉnh thay đổi
    useEffect(() => {
        if (!addressState.provinceCode) {
            setDistricts([]);
            setWards([]);
            return;
        }
        const fetchDistricts = async () => {
            try {
                const res = await fetch(`https://provinces.open-api.vn/api/p/${addressState.provinceCode}?depth=2`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setDistricts(data.districts || []);
                setWards([]);
            } catch (error) {
                console.error("Lỗi tải danh sách Quận/Huyện:", error);
            }
        };
        fetchDistricts();
    }, [addressState.provinceCode]);

    // Tải danh sách Phường/Xã khi Quận thay đổi
    useEffect(() => {
        if (!addressState.districtCode) {
            setWards([]);
            return;
        }
        const fetchWards = async () => {
            try {
                const res = await fetch(`https://provinces.open-api.vn/api/d/${addressState.districtCode}?depth=2`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setWards(data.wards || []);
            } catch (error) {
                console.error("Lỗi tải danh sách Phường/Xã:", error);
            }
        };
        fetchWards();
    }, [addressState.districtCode]);

    // Lấy thông tin user cũ từ Backend
    const fetchUser = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const res = await fetch("http://localhost:8080/current_user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) return;
            const data = await res.json();
            setCustomerInfo({
                fullName: data.full_name || '',
                phone: data.phone || ''
            });
            
            // Đổ địa chỉ cũ (nếu có) vào ô Số nhà/Tên đường để khách không phải gõ lại
            if (data.address) {
                setAddressState(prev => ({ ...prev, street: data.address }));
            }
        } catch (err) {
            console.error("Lỗi tải thông tin user:", err);
        }
    };

    // Xử lý thay đổi input thông thường
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Xử lý thay đổi dropdown địa chỉ
    const handleAddressSelect = (e, field) => {
        const value = e.target.value;
        const name = e.target.options ? e.target.options[e.target.selectedIndex].text : e.target.value;
        
        setAddressState(prev => {
            const newState = { ...prev, [field]: value };
            if (field === 'provinceCode') {
                newState.provinceName = value ? name : "";
                newState.districtCode = ""; newState.districtName = "";
                newState.wardCode = ""; newState.wardName = "";
            } else if (field === 'districtCode') {
                newState.districtName = value ? name : "";
                newState.wardCode = ""; newState.wardName = "";
            } else if (field === 'wardCode') {
                newState.wardName = value ? name : "";
            } else if (field === 'street') {
                newState.street = value;
            }
            return newState;
        });
        
        if (formErrors.address) setFormErrors(prev => ({ ...prev, address: '' }));
    };

    const handlePaymentChange = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    // Validate toàn bộ Form
    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!customerInfo.fullName.trim()) {
            errors.fullName = "Vui lòng nhập họ và tên người nhận";
            isValid = false;
        }

        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!customerInfo.phone.trim()) {
            errors.phone = "Vui lòng nhập số điện thoại";
            isValid = false;
        } else if (!phoneRegex.test(customerInfo.phone)) {
            errors.phone = "Số điện thoại không đúng định dạng";
            isValid = false;
        }

        if (!addressState.provinceCode || !addressState.districtCode || !addressState.wardCode || !addressState.street.trim()) {
            errors.address = "Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã và nhập số nhà.";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleCheckout = async () => {
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setError(null);
        setLoading(true);

        // 1. Chuẩn hóa chuỗi địa chỉ
        const fullAddress = `${addressState.street}, ${addressState.wardName}, ${addressState.districtName}, ${addressState.provinceName}`;
        
        // 2. Gọi OpenRouteService dịch địa chỉ ra tọa độ (Geocoding)
        let customerLng = null;
        let customerLat = null;
        try {
            // Thay bằng API Key thật của bạn
            const orsApiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJlYWYxZmNkZDMxYTQ3YzJhZWMwOWY2NDgxZjYyNWIyIiwiaCI6Im11cm11cjY0In0="; 
            const geoRes = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${orsApiKey}&text=${encodeURIComponent(fullAddress)}`);
            const geoData = await geoRes.json();
            
            if (geoData.features && geoData.features.length > 0) {
                const coordinates = geoData.features[0].geometry.coordinates;
                customerLng = coordinates[0];
                customerLat = coordinates[1];
            }
        } catch (error) {
            console.warn("Không thể lấy tọa độ, tiến hành tạo đơn hàng với dữ liệu Null.");
        }

        // 3. Gửi Payload đặt hàng xuống Spring Boot
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert("Phiên đăng nhập hết hạn!");
                navigate('/login');
                return;
            }

            const payload = {
                payment_method: formData.paymentMethod,
                full_name: customerInfo.fullName,
                phone: customerInfo.phone,
                delivery_address: fullAddress,
                customerLng: customerLng?.toString(), // Truyền tọa độ xuống Backend
                customerLat: customerLat?.toString()
            };

            console.log("Dữ liệu chuẩn bị gửi xuống Backend:", payload);

            const response = await fetch('http://localhost:8080/customer/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const text = await response.text();
            let data;
            try { data = JSON.parse(text); } catch { throw new Error("Server Error: " + text); }

            if (!response.ok) {
                if (response.status === 400 && data.error?.includes('cung cấp đầy đủ')) {
                    alert('Vui lòng cập nhật đầy đủ thông tin trong hồ sơ cá nhân trước khi đặt hàng.');
                    return;
                }
                throw new Error(data.error || 'Có lỗi xảy ra khi đặt hàng');
            }

            // Xử lý thành công
            if (data.payment_url) {
                window.location.href = data.payment_url;
            } else {
                if (fetchCartItems) fetchCartItems();
                navigate(`/checkout/success?status=success&order_id=${data.order_id}`);
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f8f9fa] font-sans text-[#333]">
            <div className="relative flex min-h-screen w-full flex-col">
                <Header />

                <main className="flex-grow pt-32 pb-20">
                    <div className="container mx-auto px-4 md:px-10 lg:px-20">

                        <div className="mb-8">
                            <h1 className="text-[#1a3c7e] text-3xl font-bold uppercase tracking-wide">
                                Thanh toán
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2 space-y-6">

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
                                    <h2 className="text-[#1a3c7e] text-xl font-bold flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                        <span className="material-symbols-outlined text-2xl">person_pin_circle</span>
                                        Thông tin giao hàng
                                    </h2>

                                    <div className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên người nhận <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={customerInfo.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Ví dụ: Nguyễn Văn A"
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${formErrors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1a3c7e]'}`}
                                                />
                                                {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={customerInfo.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Ví dụ: 0912345678"
                                                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${formErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1a3c7e]'}`}
                                                />
                                                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                                            </div>
                                        </div>

                                        {/* Khu vực Chọn Địa chỉ 3 cấp */}
                                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                                            <h3 className="text-sm font-bold text-gray-700 uppercase">Khu vực giao hàng <span className="text-red-500">*</span></h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <select
                                                        value={addressState.provinceCode}
                                                        onChange={(e) => handleAddressSelect(e, 'provinceCode')}
                                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c7e]"
                                                    >
                                                        <option value="">-- Tỉnh / Thành phố --</option>
                                                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <select
                                                        value={addressState.districtCode}
                                                        onChange={(e) => handleAddressSelect(e, 'districtCode')}
                                                        disabled={!addressState.provinceCode}
                                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c7e] disabled:bg-gray-100"
                                                    >
                                                        <option value="">-- Quận / Huyện --</option>
                                                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                                    </select>
                                                </div>

                                                <div>
                                                    <select
                                                        value={addressState.wardCode}
                                                        onChange={(e) => handleAddressSelect(e, 'wardCode')}
                                                        disabled={!addressState.districtCode}
                                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c7e] disabled:bg-gray-100"
                                                    >
                                                        <option value="">-- Phường / Xã --</option>
                                                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    value={addressState.street}
                                                    onChange={(e) => handleAddressSelect(e, 'street')}
                                                    placeholder="Ví dụ: Số 123 Đường Nam Kỳ Khởi Nghĩa..."
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3c7e]"
                                                />
                                            </div>
                                            
                                            {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Component Phương thức thanh toán VNPAY/COD giữ nguyên như cũ */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
                                    <h2 className="text-[#1a3c7e] text-xl font-bold flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                        <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                                        Phương thức thanh toán
                                    </h2>

                                    <div className="space-y-4">
                                        <label
                                            className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                                            ${formData.paymentMethod === 'VNPAY'
                                                    ? 'border-[#1a3c7e] bg-blue-50/30'
                                                    : 'border-gray-100 hover:border-blue-200'}`}
                                            onClick={() => handlePaymentChange('VNPAY')}
                                        >
                                            <div className="flex items-center justify-center">
                                                <input type="radio" checked={formData.paymentMethod === 'VNPAY'} readOnly className="w-5 h-5 accent-[#1a3c7e]"/>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-[#333] text-lg">Ví VNPAY / Thẻ ATM / QR Code</p>
                                                <p className="text-sm text-gray-500 mt-1">Thanh toán an toàn, nhanh chóng qua cổng VNPAY</p>
                                            </div>
                                            <div className="h-8 md:h-10 w-auto bg-white rounded px-2 py-1 flex items-center justify-center border border-gray-100">
                                                <img src="https://sandbox.vnpayment.vn/paymentv2/images/logo-vnpay@2x.png" alt="VNPAY" className="h-full object-contain"/>
                                            </div>
                                        </label>

                                        <label
                                            className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                                            ${formData.paymentMethod === 'COD'
                                                    ? 'border-[#1a3c7e] bg-blue-50/30'
                                                    : 'border-gray-100 hover:border-blue-200'}`}
                                            onClick={() => handlePaymentChange('COD')}
                                        >
                                            <div className="flex items-center justify-center">
                                                <input type="radio" checked={formData.paymentMethod === 'COD'} readOnly className="w-5 h-5 accent-[#1a3c7e]"/>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-[#333] text-lg">Thanh toán khi nhận hàng (COD)</p>
                                                <p className="text-sm text-gray-500 mt-1">Thanh toán bằng tiền mặt cho nhân viên giao hàng</p>
                                            </div>
                                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                                <span className="material-symbols-outlined">local_shipping</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] sticky top-32 p-6 border border-gray-100">
                                    <h3 className="text-[#1a3c7e] text-xl font-bold uppercase border-b-2 border-[#1a3c7e] pb-3 mb-6 inline-block">
                                        Đơn hàng của bạn
                                    </h3>

                                    <div className="mb-6">
                                        <CartSummary showPaymentSection={false} />
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2">
                                            <span className="material-symbols-outlined text-lg">error</span>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleCheckout}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:-translate-y-1
                                        ${loading
                                                ? 'bg-gray-300 text-white cursor-not-allowed shadow-none'
                                                : 'bg-gradient-to-r from-[#1a3c7e] to-[#2b55a3] text-white hover:shadow-blue-200'
                                            }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang xử lý...
                                            </span>
                                        ) : (
                                            formData.paymentMethod === 'VNPAY' ? 'Thanh toán VNPAY' : 'Đặt hàng ngay'
                                        )}
                                    </button>

                                    <div className="mt-4 text-center">
                                        <p className="text-gray-400 text-xs">
                                            Cam kết bảo mật thông tin thanh toán
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}