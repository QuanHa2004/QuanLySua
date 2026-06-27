import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../../component/side-bar";

export default function AddCategory() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");

    
      const res = await fetch("http://localhost:8080/admin/categories/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Gửi token lên backend
        },
        body: JSON.stringify({ category_name: categoryName }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Thêm thành công!");
        navigate("/admin/category");
      } else {
        if (res.status === 409) {
          alert(data.error);
        } else if (res.status === 400) {
          alert(data.error);
        } else {
          alert("Lỗi hệ thống, vui lòng thử lại!");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối tới server");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="relative flex min-h-screen bg-[#f8f9fa] font-sans">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex flex-row min-h-screen">
          <div className="fixed inset-y-0 left-0 z-50 w-64">
            <SideBar />
          </div>

          <main className="flex-1 p-8 w-full">
            <div className="w-full max-w-3xl mx-auto">
              <div className="flex flex-col gap-1 mb-8">
                <p className="text-[#1a3c7e] text-3xl font-black tracking-tight uppercase">
                  Thêm danh mục
                </p>
                <p className="text-gray-500 text-sm">
                  Tạo danh mục mới để phân loại sản phẩm.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-[#1a3c7e] mb-6 flex items-center gap-2">
                      <span className="p-2 rounded-lg bg-blue-50 text-[#1a3c7e]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </span>
                      Thông tin chung
                    </h3>

                    <div className="grid grid-cols-1 gap-6">
                      <label className="flex flex-col w-full gap-2">
                        <span className="text-[#1a3c7e] text-sm font-bold">
                          Tên danh mục <span className="text-red-500">*</span>
                        </span>
                        <input
                          type="text"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-[#333] placeholder-gray-400 focus:outline-none focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] transition-all duration-200"
                          placeholder="Ví dụ: Sữa tươi, Sữa chua..."
                          required
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="h-11 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                    >
                      Hủy bỏ
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-8 rounded-xl bg-[#1a3c7e] text-white font-bold shadow-lg shadow-blue-100 hover:bg-[#15326d] hover:-translate-y-0.5 disabled:opacity-70 disabled:translate-y-0 transition-all duration-300 flex items-center gap-2"
                    >
                      {isSubmitting ? "Đang lưu..." : "Lưu danh mục"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}