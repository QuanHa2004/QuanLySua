import { useNavigate } from 'react-router-dom';
import CartSummary from '../../../component/cart-summary';
import Footer from '../../../component/footer';
import Header from '../../../component/header';
import useCart from '../../../context/cart-context';
import CartItem from './cart-item';

export default function Cart() {
    const navigate = useNavigate();
    const { cartItems } = useCart();

    // Xử lý khi người dùng nhấn thanh toán
    const handleCheckOut = async () => {
        const token = localStorage.getItem("access_token");

        // Chưa đăng nhập → kiểm tra giỏ hàng localStorage
        if (!token) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            if (cart.length === 0) {
                alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
                return;
            }

            const hasCheckedItems = cart.some(item => item.is_checked === true);
            if (!hasCheckedItems) {
                alert("Vui lòng chọn ít nhất một sản phẩm để tiến hành thanh toán!");
                return;
            }

            localStorage.setItem("post_login_redirect", "/carts");
            navigate("/login");
            return;
        }

        // Đã đăng nhập → kiểm tra giỏ hàng từ backend
        if (cartItems.length === 0) {
            alert("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
            return;
        }

        const hasCheckedItems = cartItems.some(item => item.is_checked === true);
        if (!hasCheckedItems) {
            alert("Vui lòng chọn ít nhất một sản phẩm để tiến hành thanh toán!");
            return;
        }

        // Kiểm tra token hợp lệ
        try {
            const res = await fetch("http://localhost:8080/current_user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                localStorage.setItem("post_login_redirect", "/carts");
                navigate("/login");
                return;
            }

            navigate("/checkout");

        } catch (err) {
            console.error(err);
            alert("Đã xảy ra lỗi. Vui lòng thử lại!");
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
                                Giỏ hàng của bạn
                            </h1>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-2/3">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                                    <div className="p-6 md:p-8">
                                        <CartItem />
                                    </div>
                                </div>

                                <div className="flex justify-start">
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="group flex items-center gap-2 text-[#1a3c7e] font-bold py-3 px-6 rounded-full border border-[#1a3c7e] hover:bg-[#1a3c7e] hover:text-white transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                        </svg>
                                        Tiếp tục mua hàng
                                    </button>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/3">
                                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] sticky top-32 p-6 border border-gray-100">
                                    <h3 className="text-[#1a3c7e] text-xl font-bold uppercase border-b-2 border-[#1a3c7e] pb-3 mb-6 inline-block">
                                        Tóm tắt đơn hàng
                                    </h3>

                                    <div className="space-y-4">
                                        <CartSummary />
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <button
                                            onClick={handleCheckOut}
                                            className="w-full bg-gradient-to-r from-[#1a3c7e] to-[#2b55a3] text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-blue-200 hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide"
                                        >
                                            Tiến hành thanh toán
                                        </button>

                                        <div className="mt-4 text-center">
                                            <p className="text-gray-500 text-xs">
                                                Bằng việc tiến hành thanh toán, bạn đồng ý với
                                                <span className="text-[#1a3c7e] underline cursor-pointer ml-1">Điều khoản dịch vụ</span>
                                            </p>
                                        </div>
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
