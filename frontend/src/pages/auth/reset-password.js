import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Bảo vệ route
  if (!email || !otp) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra password nhập lại
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp! Vui lòng nhập lại.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi đặt lại mật khẩu");
      }

      alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/login");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fc]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#1a3c7e] text-center mb-6">Đặt Lại Mật Khẩu</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1a3c7e] mb-2">Mật khẩu mới</label>
            <input
              type="password"
              required
              className="w-full p-3 border rounded-xl focus:border-[#1a3c7e] outline-none"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1a3c7e] mb-2">Xác nhận mật khẩu</label>
            <input
              type="password"
              required
              className="w-full p-3 border rounded-xl focus:border-[#1a3c7e] outline-none"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button disabled={loading} className="w-full py-3 bg-[#1a3c7e] text-white font-bold rounded-xl hover:bg-[#15326d] mt-4">
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}