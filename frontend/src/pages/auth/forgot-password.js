import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra");
      }

      alert("Mã OTP đã được gửi!");
      navigate("/verify-otp", { state: { email: email } });

    } catch (err) {
      alert(err.message); // Thông báo email không hợp lệ
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fc]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#1a3c7e] text-center mb-6">Quên Mật Khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1a3c7e] mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full p-3 border rounded-xl focus:border-[#1a3c7e] outline-none"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button disabled={loading} className="w-full py-3 bg-[#1a3c7e] text-white font-bold rounded-xl hover:bg-[#15326d]">
            {loading ? "Đang kiểm tra..." : "Tiếp tục"}
          </button>
        </form>
      </div>
    </div>
  );
}