import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Đã bỏ useSearchParams
import Footer from '../../../component/footer';
import Header from '../../../component/header';
import useCart from '../../../context/cart-context';
import NutrientSection from "./nutrient-section";

export default function ProductDetail() {
    // ================== 1. Hook từ React Router / Context ==================
    const { product_id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // ================== 2. State quản lý dữ liệu ==================
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [relatedProducts, setRelatedProducts] = useState([]);

    // ================== 3. useEffect (fetch dữ liệu) ==================

    // Fetch thông tin sản phẩm chính
    useEffect(() => {
        window.scrollTo(0, 0); 

        fetch(`http://localhost:8080/customer/products/${product_id}`)
            .then((res) => res.json())
            .then((data) => {
                // Do đã bỏ variant, ta chỉ cần set thẳng data vào state
                setProduct(data);
                setQuantity(1); // Reset số lượng về 1 khi chuyển sang sản phẩm khác
            })
            .catch(err => console.error("Lỗi tải sản phẩm:", err));
    }, [product_id]);

    // Fetch danh sách sản phẩm gợi ý (3 sản phẩm khác sản phẩm hiện tại)
    useEffect(() => {
        fetch("http://localhost:8080/customer/products")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data.data)) {
                    const others = data.data
                        .filter(p => String(p.product_id) !== String(product_id))
                        .slice(0, 3);
                    setRelatedProducts(others);
                }
            })
            .catch((err) => console.error("Lỗi tải sản phẩm gợi ý:", err));
    }, [product_id]);

    // ================== 4. Handlers ==================

    const handleAdd = async (e) => {
        e.stopPropagation();

        // Check tồn kho trực tiếp từ bảng Product
        if (!product.quantity || product.quantity <= 0) {
            alert("Sản phẩm đã tạm hết hàng!");
            return;
        }

        try {
            await addToCart(
                {
                    product_id: product.product_id,
                    product_name: product.product_name,
                    image_url: product.image_url,
                    price: product.price
                },
                quantity
            );
            alert("Đã thêm vào giỏ hàng thành công!");
        } catch (err) {
            console.error("Add to cart failed:", err);
            alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
        }
    };

    // Hàm tăng số lượng không được vượt quá tồn kho thực tế
    const increase = () => {
        setQuantity((prev) => Math.min(prev + 1, product.quantity || 1));
    };

    const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));

    const handleRelatedClick = (id) => {
        navigate(`/product-details/${id}`);
    };

    if (!product) return <div className="flex justify-center items-center h-screen font-bold text-[#1a3c7e]">Đang tải dữ liệu...</div>;

    // ================== 5. Render ==================
    return (
        <div className="bg-white font-sans text-[#333]">
            <div className="relative flex min-h-screen w-full flex-col">
                <Header />

                <main className="flex-grow pt-32 pb-20">
                    <div className="container mx-auto px-4 md:px-10 lg:px-20">
                        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

                            {/* Cột ảnh sản phẩm */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative w-full pt-[100%] bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                    <div
                                        className="absolute inset-0 bg-center bg-no-repeat bg-contain m-8 transition-transform duration-500 hover:scale-105"
                                        style={{ backgroundImage: `url(${product.image_url})` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Cột thông tin sản phẩm */}
                            <div className="w-full lg:w-1/2 flex flex-col">
                                <h1 className="text-[#1a3c7e] text-3xl md:text-4xl font-bold leading-tight mb-4">
                                    {product.product_name}
                                </h1>

                                <div className="border-b border-gray-100 pb-6 mb-6">
                                    <p className="text-gray-600 text-base leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="border-b border-gray-100 pb-6 mb-6">
                                    <p className="text-gray-600 text-base leading-relaxed">
                                        HSD: {product.expiration_date}
                                    </p>
                                </div>
                                
                                {/* --- ĐÃ BỔ SUNG PHẦN GIÁ VÀ GIỎ HÀNG BỊ THIẾU --- */}
                                <div className="mb-8">
                                    <span className="text-3xl font-bold text-red-600">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
                                    </span>
                                    <span className="ml-4 text-sm text-gray-500">
                                        (Còn lại: {product.quantity || 0} sản phẩm)
                                    </span>
                                </div>

                                <div className="flex items-center gap-6 mb-8">
                                    {/* Bộ đếm số lượng */}
                                    <div className="flex items-center border border-gray-200 rounded-full h-12 w-36">
                                        <button onClick={decrease} className="w-10 h-full text-gray-500 hover:text-[#1a3c7e] text-xl font-medium focus:outline-none">-</button>
                                        <input 
                                            type="text" 
                                            readOnly 
                                            value={quantity} 
                                            className="w-full h-full text-center border-none focus:ring-0 text-base font-bold text-[#1a3c7e] bg-transparent"
                                        />
                                        <button onClick={increase} className="w-10 h-full text-gray-500 hover:text-[#1a3c7e] text-xl font-medium focus:outline-none">+</button>
                                    </div>

                                    {/* Nút thêm giỏ hàng */}
                                    <button 
                                        onClick={handleAdd}
                                        disabled={!product.quantity || product.quantity <= 0}
                                        className={`flex-1 h-12 rounded-full font-bold text-white transition-all duration-300 shadow-md ${
                                            product.quantity > 0 
                                            ? "bg-[#1a3c7e] hover:bg-[#122a59] hover:shadow-lg" 
                                            : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        {product.quantity > 0 ? "THÊM VÀO GIỎ" : "TẠM HẾT HÀNG"}
                                    </button>
                                </div>
                                {/* ------------------------------------------------ */}

                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-10">
                            <NutrientSection product={product} />
                        </div>

                        {/* === PHẦN SẢN PHẨM GỢI Ý === */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-16">
                                <div className="text-center mb-10">
                                    <h2 className="text-[#1a3c7e] text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">
                                        Có thể bạn sẽ thích
                                    </h2>
                                    <div className="w-16 h-1 bg-[#1a3c7e] mx-auto rounded-full"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {relatedProducts.map((relProduct) => (
                                        <div
                                            key={relProduct.product_id}
                                            onClick={() => handleRelatedClick(relProduct.product_id)}
                                            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="relative pt-[100%] overflow-hidden bg-white p-6">
                                                <div
                                                    className="absolute inset-0 m-6 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
                                                    style={{ backgroundImage: `url("${relProduct.image_url}")` }}
                                                ></div>
                                            </div>
                                            <div className="p-5 text-center bg-gray-50/50">
                                                <h3 className="text-[#1a3c7e] font-bold text-lg mb-2 line-clamp-2 min-h-[56px] group-hover:text-[#4096ff] transition-colors">
                                                    {relProduct.product_name}
                                                </h3>
                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                                                    {relProduct.description}
                                                </p>
                                                <button className="text-[#1a3c7e] text-sm font-bold hover:underline">
                                                    Xem chi tiết &rarr;
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}