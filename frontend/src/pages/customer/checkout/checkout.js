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

    const [formData, setFormData] = useState({
        paymentMethod: 'COD'
    });

    const [customerInfo, setCustomerInfo] = useState({
        fullName: '',
        phone: '',
        address: ''
    });

    // Gọi API lấy thông tin người dùng ngay khi vào trang
    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) return; // Nếu chưa đăng nhập thì thôi, để form trống

        try {
            const res = await fetch("http://localhost:8080/current_user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                // Token lỗi hoặc hết hạn -> có thể điều hướng login nếu muốn
                return;
            }

            const data = await res.json();

            setCustomerInfo({
                fullName: data.full_name || '',
                phone: data.phone || '',
                address: data.address || ''
            });

        } catch (err) {
            console.error("Lỗi tải thông tin user:", err);
        }
    };

    // Xử lý khi người dùng gõ vào ô input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));

        // Xóa lỗi khi người dùng bắt đầu sửa
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Chọn phương thức thanh toán
    const handlePaymentChange = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    // Validate Form
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

        if (!customerInfo.address.trim()) {
            errors.address = "Vui lòng nhập địa chỉ nhận hàng";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // Xử lý nút Đặt hàng
    const handleCheckout = async () => {
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert("Phiên đăng nhập hết hạn!");
                navigate('/login');
                return;
            }

            const payload = {
                payment_method: formData.paymentMethod,
                full_name: customerInfo.fullName,       // Bổ sung tên
                phone: customerInfo.phone,              // Bổ sung SĐT
                delivery_address: customerInfo.address  // Bổ sung Địa chỉ
            };

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
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Server Error: " + text);
            }

            if (!response.ok) {
                if (response.status === 400 && data.error?.includes('cung cấp đầy đủ')) {
                    alert('Vui lòng cập nhật đầy đủ thông tin trong hồ sơ cá nhân trước khi đặt hàng.');
                    return;
                }
                throw new Error(data.error || 'Có lỗi xảy ra khi đặt hàng');
            }

            // ================= XỬ LÝ THÀNH CÔNG =================
            if (data.payment_url) {
                // 1. Nếu là VNPAY -> Chuyển hướng thẳng sang cổng thanh toán
                window.location.href = data.payment_url;
            } else {
                // 2. Nếu là COD -> Chuyển hướng sang trang báo thành công
                if (fetchCartItems) fetchCartItems(); // Cập nhật lại số lượng giỏ hàng trên Header

                // THÊM `status=success` ĐỂ KHỚP VỚI TRANG CHECKOUT SUCCESS VỪA VIẾT
                navigate(`/checkout/success?status=success&order_id=${data.order_id}`);
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
            alert("Lỗi: " + err.message);
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

                                    <div className="space-y-4">
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

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={customerInfo.address}
                                                onChange={handleInputChange}
                                                placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${formErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1a3c7e]'}`}
                                            />
                                            {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                                        </div>
                                    </div>
                                </div>

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
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={formData.paymentMethod === 'VNPAY'}
                                                    readOnly
                                                    className="w-5 h-5 accent-[#1a3c7e]"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-[#333] text-lg">Ví VNPAY / Thẻ ATM / QR Code</p>
                                                <p className="text-sm text-gray-500 mt-1">Thanh toán an toàn, nhanh chóng qua cổng VNPAY</p>
                                            </div>
                                            <div className="h-8 md:h-10 w-auto bg-white rounded px-2 py-1 flex items-center justify-center border border-gray-100">
                                                <img
                                                    src="https://sandbox.vnpayment.vn/paymentv2/images/logo-vnpay@2x.png"
                                                    alt="VNPAY"
                                                    className="h-full object-contain"
                                                />
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
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={formData.paymentMethod === 'COD'}
                                                    readOnly
                                                    className="w-5 h-5 accent-[#1a3c7e]"
                                                />
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