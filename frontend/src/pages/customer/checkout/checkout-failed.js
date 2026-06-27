import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Footer from '../../../component/footer';
import Header from '../../../component/header';

export default function CheckoutFailed() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const errorCode = searchParams.get('error_code');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // Lấy thông báo lỗi theo mã lỗi
    const getErrorMessage = (code) => {
        switch (code) {
            case '24': return "Bạn đã hủy giao dịch";
            case '51': return "Tài khoản không đủ số dư";
            case '11': return "Hết hạn chờ thanh toán";
            default: return "Giao dịch không thành công";
        }
    };

    // Xử lý thử thanh toán lại
    const handleRetryPayment = async () => {
        if (!orderId) {
            alert("Không tìm thấy mã đơn hàng để thử lại");
            navigate('/checkout');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert("Vui lòng đăng nhập lại");
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8080/orders/retry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ order_id: orderId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Không thể tạo link thanh toán mới");
            }

            if (data.payment_url) {
                window.location.href = data.payment_url;
            } else {
                alert("Lỗi: Server không trả về link thanh toán.");
            }

        } catch (err) {
            console.error(err);
            alert("Lỗi kết nối: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f8f9fa] font-sans text-[#333]">
            <div className="relative flex min-h-screen w-full flex-col">
                <Header />

                <main className="flex-grow pt-32 pb-20 flex items-center justify-center px-4">
                    <div className="bg-white max-w-lg w-full rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 md:p-12 text-center">

                        <div className="mb-8 relative inline-block">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-5xl text-[#d32f2f]">error</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-[#1a3c7e] text-3xl font-bold mb-4">
                            Thanh toán thất bại
                        </h1>

                        <div className="space-y-4 mb-8">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Rất tiếc, giao dịch của bạn chưa được hoàn tất.
                                <br />
                                <span className="text-[#d32f2f] font-medium">
                                    {getErrorMessage(errorCode)}
                                </span>
                            </p>

                            <p className="text-gray-500 text-sm bg-gray-50 py-2 px-4 rounded-lg inline-block">
                                Tài khoản của bạn chưa bị trừ tiền.
                            </p>

                            {orderId && (
                                <div className="mt-4">
                                    <span className="text-gray-400 text-sm uppercase tracking-wider font-bold block mb-1">Mã đơn hàng</span>
                                    <span className="text-[#1a3c7e] font-mono font-bold text-lg bg-blue-50 px-4 py-1 rounded-full border border-blue-100">
                                        #{orderId}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleRetryPayment}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2
                  ${loading
                                        ? 'bg-gray-300 text-white cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-r from-[#d32f2f] to-[#ef5350] text-white hover:shadow-red-200'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">refresh</span>
                                        Thử thanh toán lại
                                    </>
                                )}
                            </button>

                            <Link
                                to="/"
                                className="w-full py-4 rounded-xl font-bold text-[#1a3c7e] border border-[#1a3c7e] hover:bg-blue-50 transition-all duration-300 uppercase tracking-wide text-sm flex items-center justify-center"
                            >
                                Về trang chủ
                            </Link>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Cần hỗ trợ? Liên hệ hotline <span className="text-[#1a3c7e] font-bold">1900 6515</span>
                            </p>
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
