import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const navigate = useNavigate();

  // --- LOGIC STATE ---
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const [showPassword, setShowPassword] = useState(false); // Thêm trạng thái ẩn/hiện pass

  // --- LOGIC HANDLERS ---

  // Cập nhật giá trị input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (message) setMessage("");
  };

  // Xử lý đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const nameRegex = /^[^\d]+$/;
    const phoneRegex = /^0\d{9}$/; // Lưu ý: Regex này check 11 số bắt đầu bằng 0 (theo code gốc của bạn)
    const passwordRegex = /^.{6,}$/;

    // Validation
    if (!nameRegex.test(formData.full_name.trim())) {
      setMessage("Tên không được chứa số");
      setLoading(false);
      return;
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setMessage("Số điện thoại phải gồm 11 chữ số và bắt đầu bằng số 0");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setMessage("Mật khẩu phải nhiều hơn 5 ký tự");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Mật khẩu xác nhận không giống!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone,
          address: formData.address,
          password: formData.password,
          role_id: 2,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      setMessage("Đăng ký thành công! Đang chuyển hướng...");

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      });

      // Chuyển hướng sang login sau 1.5s
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- GIAO DIỆN (JSX) ---
  return (
    <div className="font-sans bg-[#f4f7fc] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3 shadow-sm border border-blue-100">
            <span className="material-symbols-outlined text-3xl text-[#1a3c7e]">person_add</span>
          </div>
          <h2 className="text-3xl font-bold text-[#1a3c7e] tracking-tight">Đăng ký thành viên</h2>
          <p className="text-gray-500 mt-2">Trở thành thành viên để nhận nhiều ưu đãi hấp dẫn</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            {/* Hàng 1: Họ tên & SĐT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#1a3c7e]">Họ và tên</label>
                <input
                  name="full_name"
                  type="text"
                  placeholder="Nhập họ tên"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[#333] placeholder-gray-400 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] focus:outline-none transition-all"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#1a3c7e]">Số điện thoại</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Nhập SĐT (10 số)"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[#333] placeholder-gray-400 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] focus:outline-none transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1a3c7e]">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[#333] placeholder-gray-400 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] focus:outline-none transition-all"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Địa chỉ */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1a3c7e]">Địa chỉ</label>
              <input
                name="address"
                type="text"
                placeholder="Nhập địa chỉ nhận hàng"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[#333] placeholder-gray-400 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] focus:outline-none transition-all"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Mật khẩu */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1a3c7e]">Mật khẩu</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"} // Xử lý ẩn hiện
                  placeholder="Tạo mật khẩu (>5 ký tự)"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-4 pr-12 text-[#333] placeholder-gray-400 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] focus:outline-none transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-0 px-4 text-gray-400 hover:text-[#1a3c7e] flex items-center"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#1a3c7e]">Xác nhận mật khẩu</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-[#333] placeholder-gray-400 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] focus:outline-none transition-all"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Hiển thị thông báo lỗi/thành công */}
            {message && (
              <div className={`p-3 rounded-lg text-sm text-center font-medium ${message.includes("thành công") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-[#1a3c7e] to-[#2b55a3] text-white font-bold text-base shadow-lg shadow-blue-100 hover:shadow-blue-200 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đăng Ký Ngay"}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-gray-600">
              Bạn đã có tài khoản?{" "}
              <span
                onClick={() => navigate('/login')}
                className="text-[#1a3c7e] font-bold hover:underline cursor-pointer ml-1"
              >
                Đăng nhập
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}