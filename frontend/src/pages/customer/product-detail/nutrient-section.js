export default function NutrientSection({ product }) {
    return (
        <div className="mt-0 pt-10 border-t border-gray-100">
            <div className="text-center mb-10">
                <h3 className="text-[#1a3c7e] text-2xl md:text-3xl font-bold uppercase tracking-wide inline-block relative pb-3">
                    Thông tin sản phẩm
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#1a3c7e] rounded-full"></span>
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mb-16">
                <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100">
                    <h4 className="text-[#1a3c7e] text-lg font-bold mb-6 flex items-center">
                        <span className="w-1 h-6 bg-[#1a3c7e] mr-3 rounded-full"></span>
                        Thông tin chung
                    </h4>

                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-1">Xuất xứ</label>
                            <p className="text-[#333] font-medium text-lg">{product.origin || "Việt Nam"}</p>
                        </div>

                        <div className="w-full h-px bg-gray-200"></div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-1">Thành phần</label>
                            <p className="text-[#333] leading-relaxed text-justify">{product.ingredients || "100% Sữa tươi nguyên chất"}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100">
                    <h4 className="text-[#1a3c7e] text-lg font-bold mb-6 flex items-center">
                        <span className="w-1 h-6 bg-[#1a3c7e] mr-3 rounded-full"></span>
                        Hướng dẫn & Bảo quản
                    </h4>

                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-1">Hướng dẫn sử dụng</label>
                            <p className="text-[#333] leading-relaxed">{product.usage || "Dùng trực tiếp, ngon hơn khi uống lạnh."}</p>
                        </div>

                        <div className="w-full h-px bg-gray-200"></div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-1">Bảo quản</label>
                            <p className="text-[#333] leading-relaxed">{product.storage || "Để nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp."}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[#1a3c7e] text-xl font-bold">Giá trị dinh dưỡng</h4>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Tính trên 100ml</span>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#e0e6ed] shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        <div className="border-b lg:border-b-0 lg:border-r border-[#e0e6ed]">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#1a3c7e]">
                                        <th className="py-3 px-6 text-left text-white font-semibold text-sm">Chỉ số chính</th>
                                        <th className="py-3 px-6 text-right text-white font-semibold text-sm">Hàm lượng</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {[
                                        { label: "Năng lượng", value: product.calories, unit: "kcal" },
                                        { label: "Chất đạm (Protein)", value: product.protein, unit: "g" },
                                        { label: "Chất béo (Fat)", value: product.fat, unit: "g" },
                                        { label: "Hydrat cacbon", value: product.carbohydrates, unit: "g" },
                                        { label: "Đường", value: product.sugar, unit: "g" },
                                    ].map((item, index) => (
                                        <tr key={index} className="border-b border-[#f0f0f0] last:border-0 hover:bg-blue-50 transition-colors">
                                            <td className="py-3 px-6 text-gray-700 font-medium">{item.label}</td>
                                            <td className="py-3 px-6 text-right text-[#1a3c7e] font-bold">
                                                {item.value || 0} <span className="text-xs text-gray-500 font-normal ml-1">{item.unit}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#1a3c7e]">
                                        <th className="py-3 px-6 text-left text-white font-semibold text-sm">Vitamin & Khoáng chất</th>
                                        <th className="py-3 px-6 text-right text-white font-semibold text-sm">Đáp ứng</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {(() => {
                                        try {
                                            const vits = product.vitamins ? JSON.parse(product.vitamins) : {};
                                            const mins = product.minerals ? JSON.parse(product.minerals) : {};
                                            const micros = { ...vits, ...mins };

                                            if (Object.keys(micros).length === 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan="2" className="py-8 text-center text-gray-400 italic text-sm">
                                                            Thông tin đang được cập nhật
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            return Object.entries(micros).map(([k, v], i) => (
                                                <tr key={i} className="border-b border-[#f0f0f0] last:border-0 hover:bg-blue-50 transition-colors">
                                                    <td className="py-3 px-6 text-gray-700 font-medium">{k}</td>
                                                    <td className="py-3 px-6 text-right text-[#1a3c7e] font-bold">{v}</td>
                                                </tr>
                                            ));
                                        } catch {
                                            return (
                                                <tr>
                                                    <td colSpan="2" className="py-4 text-center text-gray-400"></td>
                                                </tr>
                                            );
                                        }
                                    })()}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}