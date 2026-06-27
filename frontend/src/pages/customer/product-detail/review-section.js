import { useState, useEffect } from "react";

export default function ReviewSection({ product_id, currentVariant }) {
    const [reviews, setReviews] = useState([]);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const fetchReviews = () => {
        if (!product_id || !currentVariant?.variant_id) return;

        fetch(`http://localhost:8080/reviews/${product_id}/${currentVariant.variant_id}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data.data || []);
            })
            .catch(err => console.error("Lỗi tải đánh giá:", err));
    };

    useEffect(() => {
        fetchReviews();
    }, [product_id, currentVariant?.variant_id]);

    const handleSubmitReview = async () => {
        if (!rating) {
            alert("Vui lòng chọn số sao đánh giá");
            return;
        }

        if (!currentVariant) {
            alert("Vui lòng chọn biến thể sản phẩm");
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert("Vui lòng đăng nhập để đánh giá");
            return;
        }

        try {
            setIsSubmittingReview(true);

            const res = await fetch("http://localhost:8080/reviews/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    variant_id: currentVariant.variant_id,
                    rating: rating,
                    comment: comment,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Gửi đánh giá thất bại");
            }

            fetchReviews();

            alert("Cảm ơn bạn đã đánh giá sản phẩm");

            setRating(0);
            setComment("");

        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div className="mt-16">
            <h3 className="text-[#1a3c7e] text-2xl font-bold uppercase tracking-wide border-b-2 border-[#1a3c7e] inline-block pb-2 mb-8">
                Đánh giá từ khách hàng
            </h3>

            <div className="bg-[#f8f9fa] rounded-2xl p-6 md:p-8 mb-10 border border-gray-100">
                <h4 className="text-lg font-bold text-[#333] mb-4">Gửi nhận xét của bạn</h4>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">Đánh giá của bạn:</span>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={star <= rating ? "#fbbf24" : "none"}
                                        stroke={star <= rating ? "#fbbf24" : "#cbd5e1"}
                                        strokeWidth="2"
                                        className="w-8 h-8"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <textarea
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-[#333] placeholder-gray-400 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] focus:outline-none transition-all shadow-sm resize-none"
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmitReview}
                            disabled={isSubmittingReview}
                            className="bg-[#1a3c7e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#15326d] hover:shadow-lg active:transform active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Gửi Đánh Giá
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="bg-white border-b border-gray-100 last:border-0 pb-6 mb-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#1a3c7e] font-bold text-xl uppercase shrink-0">
                                    {review.full_name ? review.full_name.charAt(0) : "U"}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-[#333] text-lg">
                                            {review.full_name}
                                        </h5>
                                        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                            {new Date(review.created_at).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <svg
                                                key={s}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill={s <= review.rating ? "#fbbf24" : "#e2e8f0"}
                                                className="w-4 h-4"
                                            >
                                                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                            </svg>
                                        ))}
                                    </div>

                                    <p className="text-gray-600 leading-relaxed text-base bg-gray-50 p-4 rounded-xl rounded-tl-none">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-2">Chưa có đánh giá nào</p>
                        <p className="text-sm text-gray-400">Hãy là người đầu tiên nhận xét về sản phẩm này</p>
                    </div>
                )}
            </div>
        </div>
    )
}