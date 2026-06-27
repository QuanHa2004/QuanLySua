import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../../component/side-bar";

export default function AddProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  const [productData, setProductData] = useState({
    product_name: "",
    category_id: "",
    manufacturer_id: "",
    image_url: "",
    description: "",
    is_hot: 0 // Giá trị mặc định là 0 (Không hot)
  });

  const [detailData, setDetailData] = useState({
    origin: "",
    ingredients: "",
    usage: "",
    storage: "",
    other_nutrients: ""
  });

  const [macros, setMacros] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    sugar: 0
  });

  const [vitamins, setVitamins] = useState([{ name: "", value: "" }]);
  const [minerals, setMinerals] = useState([{ name: "", value: "" }]);

  const inputClass =
    "w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] transition-all duration-200 text-sm";

  const labelClass =
    "text-[#1a3c7e] text-sm font-bold mb-1.5 block uppercase tracking-wide";

  const fetchList = useCallback((url, setter) => {
    fetch(url)
      .then(res => res.json())
      .then(data => setter(data.data || []))
      .catch(() => setter([]));
  }, []);

  useEffect(() => {
    fetchList("http://localhost:8080/admin/categories", setCategories);
    fetchList("http://localhost:8080/admin/manufacturers", setManufacturers);
  }, [fetchList]);

  const handleChange = (setter) => (e) =>
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Hàm xử lý riêng cho Checkbox is_hot
  const handleCheckboxChange = (e) => {
    setProductData(prev => ({
      ...prev,
      is_hot: e.target.checked ? 1 : 0
    }));
  };

  const handleDynamicChange = (index, list, setter, field, value) => {
    const updated = [...list];
    updated[index][field] = value;
    setter(updated);
  };

  const addRow = (setter) =>
    setter(prev => [...prev, { name: "", value: "" }]);

  const removeRow = (index, list, setter) => {
    if (list.length > 1) {
      const updated = [...list];
      updated.splice(index, 1);
      setter(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toObject = (arr) =>
      arr.reduce((acc, cur) => {
        if (cur.name && cur.value) acc[cur.name] = cur.value;
        return acc;
      }, {});

    const payload = {
      ...productData,
      ...detailData,
      ...macros,
      vitamins: toObject(vitamins),
      minerals: toObject(minerals)
    };

    try {
      const res = await fetch("http://localhost:8080/admin/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Thêm sản phẩm thành công!");
        navigate("/admin/product");
      } else {
        if (res.status === 409) {
          alert(data.message); // trùng tên
        } else if (res.status === 422) {
          alert(data.message);
        } else {
          alert("Lỗi hệ thống, vui lòng thử lại");
        }
      }
    } catch {
      alert("Lỗi kết nối server");
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

        <main className="p-8 w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <p className="text-[#1a3c7e] text-3xl font-black tracking-tight uppercase">Thêm sản phẩm mới</p>
              <p className="text-gray-500 text-sm">Nhập thông tin chi tiết đầy đủ cho sản phẩm sữa.</p>
            </div>

            <button
              onClick={() => navigate('/admin/add-variant')}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1a3c7e] text-white text-sm font-bold tracking-wide hover:bg-[#15326d] hover:-translate-y-0.5 transition-all shadow-md shadow-blue-100"
            >
              <span className="truncate flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Thêm biến thể mới
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 flex items-center gap-2 uppercase tracking-wide">
                <span className="p-2 rounded-lg bg-blue-50 text-[#1a3c7e]">
                  <span className="material-symbols-outlined text-lg">inventory_2</span>
                </span>
                Thông tin cơ bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <label className="lg:col-span-2">
                  <span className={labelClass}>Tên sản phẩm <span className="text-red-500">*</span></span>
                  <input name="product_name" value={productData.product_name} onChange={handleChange(setProductData)} required className={inputClass} />
                </label>

                <label>
                  <span className={labelClass}>Danh mục <span className="text-red-500">*</span></span>
                  <select name="category_id" value={productData.category_id} onChange={handleChange(setProductData)} className={inputClass} required>
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.map(c => (
                      <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className={labelClass}>Nhà sản xuất <span className="text-red-500">*</span></span>
                  <select name="manufacturer_id" value={productData.manufacturer_id} onChange={handleChange(setProductData)} className={inputClass} required>
                    <option value="">-- Chọn nhà sản xuất --</option>
                    {manufacturers.map(m => (
                      <option key={m.manufacturer_id} value={m.manufacturer_id}>{m.manufacturer_name}</option>
                    ))}
                  </select>
                </label>

                {/* --- CHECKBOX IS_HOT ĐƯỢC THÊM VÀO ĐÂY --- */}
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-[#1a3c7e] transition-all">
                    <input
                      type="checkbox"
                      name="is_hot"
                      checked={productData.is_hot === 1}
                      onChange={handleCheckboxChange}
                      className="w-5 h-5 text-[#1a3c7e] rounded border-gray-300 focus:ring-[#1a3c7e] cursor-pointer"
                    />
                    <span className="text-[#1a3c7e] text-sm font-bold uppercase tracking-wide select-none">
                      Hot
                    </span>
                  </label>
                </div>

                <label className="lg:col-span-3">
                  <span className={labelClass}>Link hình ảnh</span>
                  <input name="image_url" value={productData.image_url} onChange={handleChange(setProductData)} className={inputClass} />
                </label>

                <label className="lg:col-span-3">
                  <span className={labelClass}>Mô tả ngắn</span>
                  <textarea name="description" value={productData.description} onChange={handleChange(setProductData)} className={`${inputClass} h-24 py-2 resize-none`} />
                </label>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 flex items-center gap-2 uppercase tracking-wide">
                <span className="p-2 rounded-lg bg-blue-50 text-[#1a3c7e]">
                  <span className="material-symbols-outlined text-lg">article</span>
                </span>
                Chi tiết & Hướng dẫn
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {["origin", "ingredients", "usage", "storage"].map(f => (
                  <label key={f}>
                    <span className={labelClass}>{f}</span>
                    <input name={f} value={detailData[f]} onChange={handleChange(setDetailData)} className={inputClass} />
                  </label>
                ))}

                <label className="lg:col-span-2">
                  <span className={labelClass}>Chất bổ sung khác</span>
                  <input name="other_nutrients" value={detailData.other_nutrients} onChange={handleChange(setDetailData)} className={inputClass} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 uppercase tracking-wide">Dinh dưỡng chính</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(macros).map(k => (
                    <label key={k}>
                      <span className={labelClass}>{k}</span>
                      <input type="number" step="0.1" name={k} value={macros[k]} onChange={handleChange(setMacros)} className={inputClass} />
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 uppercase tracking-wide">Vitamin & Khoáng chất</h3>

                {[{ title: "Vitamin", list: vitamins, set: setVitamins }, { title: "Khoáng chất", list: minerals, set: setMinerals }].map((g, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-[#1a3c7e]">{g.title}</span>
                      <button type="button" onClick={() => addRow(g.set)} className="text-xs font-bold text-blue-600 hover:underline">+ Thêm dòng</button>
                    </div>
                    {g.list.map((item, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input value={item.name} onChange={e => handleDynamicChange(idx, g.list, g.set, "name", e.target.value)} className={`${inputClass} !h-9 !text-xs`} placeholder="Tên chất" />
                        <input value={item.value} onChange={e => handleDynamicChange(idx, g.list, g.set, "value", e.target.value)} className={`${inputClass} !h-9 !text-xs`} placeholder="Hàm lượng" />
                        {g.list.length > 1 && (
                          <button type="button" onClick={() => removeRow(idx, g.list, g.set)} className="text-red-500 hover:text-red-700 font-bold px-2">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => navigate(-1)} className="h-11 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">Hủy bỏ</button>
              <button type="submit" disabled={isSubmitting} className="h-11 px-8 rounded-xl bg-[#1a3c7e] text-white font-bold shadow-lg shadow-blue-100 hover:bg-[#15326d] transition-all">
                {isSubmitting ? "Đang lưu..." : "Xác nhận thêm"}
              </button>
            </div>

          </form>

        </main>
      </div>
    </div>
  );
}