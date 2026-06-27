import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useCart from "../../context/cart-context";

export default function Login() {
  const navigate = useNavigate();
  const { updateToken } = useCart();
  const [searchParams] = useSearchParams();

  // --- LOGIC STATE ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State hiển thị modal khóa tài khoản
  const [showLockModal, setShowLockModal] = useState(false);

  // --- LOGIC HANDLERS ---

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      // --- XỬ LÝ TÀI KHOẢN BỊ KHÓA (403) ---
      if (res.status === 403) {
        setShowLockModal(true); // Hiện popup
        setLoading(false);      // Tắt loading
        return;                 // Dừng xử lý
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Sai email hoặc mật khẩu");
      }

      const data = await res.json();

      // Lưu storage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("role_id", data.user.role_id);
      updateToken(data.access_token);

      // Điều hướng
      const redirectAfterLogin = localStorage.getItem("post_login_redirect");

      if (data.user.role_id === 1) {
        navigate("/admin/dashboard");
      } else if (redirectAfterLogin) {
        localStorage.removeItem("post_login_redirect");
        navigate(redirectAfterLogin);
      } else {
        navigate("/");
      }

    } catch (err) {
      alert(err.message);
    } finally {
      // Chỉ tắt loading nếu không phải trường hợp 403 (vì 403 đã tắt ở trên)
      if (!showLockModal) {
        setLoading(false);
      }
    }
  };

  // Xử lý Login Google
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  // useEffect xử lý callback từ Google
  useEffect(() => {
    const checkSocialLogin = async () => {
      const socialToken = searchParams.get('social_token');
      const errorParam = searchParams.get('error');

      if (errorParam === '403') {
        setShowLockModal(true);
        window.history.replaceState({}, document.title, "/login");
        return;
      }

      if (socialToken) {
        localStorage.setItem('access_token', socialToken);
        updateToken(socialToken);

        try {
          const res = await fetch("http://localhost:8080/current_user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${socialToken}`,
              "Content-Type": "application/json"
            }
          });

          if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");

          const userData = await res.json();

          if (userData.is_deleted === 1) {
            setShowLockModal(true);
            localStorage.clear();
            return;
          }

          localStorage.setItem("role_id", userData.role_id);

          if (userData.role_id === 1) {
            navigate('/admin/dashboard');
          } else {
            const redirectAfterLogin = localStorage.getItem("post_login_redirect");
            if (redirectAfterLogin) {
              localStorage.removeItem("post_login_redirect");
              navigate(redirectAfterLogin);
            } else {
              navigate('/');
            }
          }
        } catch (err) {
          console.error("Lỗi xác thực Google:", err);
          alert("Lỗi đăng nhập: Không thể lấy thông tin tài khoản.");
          navigate('/login');
        }
      }
    };

    checkSocialLogin();
  }, [searchParams, navigate, updateToken]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#f4f7fc]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-3xl"></div>
      </div>

      <div className="relative m-4 w-full max-w-md flex flex-col items-center justify-center rounded-2xl bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">

        <div className="flex flex-col items-center gap-2 text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2 shadow-sm">
            <svg
              className="h-8 w-8 text-[#1a3c7e]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
          <p className="text-3xl font-bold text-[#1a3c7e] tracking-tight">Chào mừng trở lại!</p>
          <p className="text-base text-gray-500">Đăng nhập để trải nghiệm mua sắm tốt nhất</p>
        </div>

        <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>

          <div className="flex flex-col w-full group">
            <label className="pb-2 text-sm font-bold text-[#1a3c7e]">Email / Số điện thoại</label>
            <div className="relative flex w-full items-center">
              <input
                type="text"
                name="email"
                placeholder="Nhập email của bạn"
                className="flex h-12 w-full rounded-xl border border-gray-200 bg-white pl-4 pr-12 text-base text-[#333] placeholder-gray-400 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-4 text-gray-400 pointer-events-none group-focus-within:text-[#1a3c7e] transition-colors">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full group">
            <label className="pb-2 text-sm font-bold text-[#1a3c7e]">Mật khẩu</label>
            <div className="relative flex w-full items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                className="flex h-12 w-full rounded-xl border border-gray-200 bg-white pl-4 pr-12 text-base text-[#333] placeholder-gray-400 focus:border-[#1a3c7e] focus:ring-1 focus:ring-[#1a3c7e] focus:outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <div
                className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-4 text-gray-400 cursor-pointer hover:text-[#1a3c7e] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end -mt-2">
            <span onClick={() => { navigate('/forgot-password') }}
              className="text-sm font-semibold text-[#1a3c7e] hover:text-[#15326d] hover:underline cursor-pointer transition-colors">
              Quên mật khẩu?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#1a3c7e] to-[#2b55a3] text-base font-bold text-white shadow-lg shadow-blue-100 transition-all hover:shadow-blue-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="w-full mt-8">
          <div className="relative flex items-center justify-center w-full mb-6">
            <div className="absolute w-full border-t border-gray-100"></div>
            <span className="relative bg-white px-4 text-sm text-gray-400 font-medium">
              Hoặc tiếp tục với
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 font-semibold"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <span
              className="font-bold text-[#1a3c7e] hover:underline cursor-pointer transition-colors"
              onClick={() => navigate('/registration')}
            >
              Đăng ký ngay
            </span>
          </p>
        </div>
      </div>

      {/* --- POPUP THÔNG BÁO TÀI KHOẢN BỊ KHÓA --- */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-[360px] shadow-xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 text-2xl">
                lock
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#1a3c7e] mb-2">
              Tài khoản bị khóa
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ với quản trị viên hoặc bộ phận hỗ trợ để biết thêm chi tiết.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowLockModal(false)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1a3c7e] text-white font-bold hover:bg-[#15326d] transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}