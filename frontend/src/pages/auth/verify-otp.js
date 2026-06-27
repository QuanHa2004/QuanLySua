import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Lấy email từ trang trước

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Nếu không có email (truy cập trực tiếp link), đá về trang forgot
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "OTP không hợp lệ");
      }

      // CHUYỂN TRANG và mang theo email + otp (để xác thực bước cuối)
      navigate("/reset-password", { state: { email: email, otp: otp } });

    } catch (err) {
      alert(err.message); // Thông báo lỗi OTP
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7fc]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#1a3c7e] text-center mb-2">Nhập mã OTP</h2>
        <p className="text-center text-gray-500 mb-6">Mã đã được gửi tới {email}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength="6"
              required
              className="w-full p-3 text-center text-2xl tracking-widest border rounded-xl focus:border-[#1a3c7e] outline-none font-bold"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button disabled={loading} className="w-full py-3 bg-[#1a3c7e] text-white font-bold rounded-xl hover:bg-[#15326d]">
            {loading ? "Đang xác thực..." : "Xác nhận"}
          </button>
        </form>
      </div>
    </div>
  );
}