import Footer from '../../../component/footer';
import Header from '../../../component/header';
import ProductOption from './product-option';

export default function Product() {
    return (
        <div className="bg-[#f8f9fa] font-sans text-[#333]">
            <div className="relative flex min-h-screen w-full flex-col">
                <Header />

                <main className="flex-grow pt-36 pb-20">
                    <div className="container mx-auto px-4 md:px-10 lg:px-20">

                        <div className="w-full h-48 md:h-64 bg-blue-50 rounded-2xl mb-10 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c7e] to-[#4096ff] opacity-10"></div>
                            <div className="text-center z-10 px-4">
                                <h2 className="text-[#1a3c7e] text-2xl md:text-3xl font-bold mb-2">Nguồn Dinh Dưỡng Xanh</h2>
                                <p className="text-gray-600">Thơm ngon - Thuần khiết - Tự nhiên</p>
                            </div>
                        </div>

                        <div className="text-center mb-0">
                            <h1 className="text-[#1a3c7e] text-3xl md:text-4xl font-bold uppercase tracking-wide mb-3">
                                Our Fresh Milk Selection
                            </h1>
                            <div className="w-24 h-1 bg-[#1a3c7e] mx-auto rounded-full"></div>
                        </div>

                        <div className="bg-transparent">
                            <ProductOption />
                        </div>

                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
