import { useSearchParams, Link } from 'react-router-dom';

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');

    return (
        <div className="bg-[#f8f9fa] font-sans text-[#333]">
            <div className="relative flex min-h-screen w-full flex-col">

                <main className="flex-grow pt-32 pb-20 flex items-center justify-center px-4">
                    <div className="bg-white max-w-lg w-full rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 md:p-12 text-center">

                        <div className="mb-8 relative inline-block">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-[#1a3c7e] text-3xl font-bold mb-4">
                            Thanh toán thành công!
                        </h1>

                        <div className="space-y-4 mb-8">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Cảm ơn bạn đã tin tưởng và mua sắm tại Vinamilk.
                                <br />
                                Đơn hàng của bạn đang được xử lý.
                            </p>

                            {orderId && (
                                <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-xl p-4 inline-block w-full">
                                    <span className="text-gray-500 text-xs uppercase tracking-wider font-bold block mb-1">Mã đơn hàng</span>
                                    <span className="text-[#1a3c7e] font-mono font-bold text-2xl">
                                        #{orderId}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Vui lòng kiểm tra email để xem chi tiết đơn hàng
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <Link
                                to="/products"
                                className="w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg shadow-green-100 bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Mọi thắc mắc xin vui lòng liên hệ <span className="text-[#1a3c7e] font-bold">1900 6515</span>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
