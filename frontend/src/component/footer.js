export default function Footer() {
  return (
    <footer className="bg-[#1a3c7e] text-white pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          <div className="space-y-4">
            <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">FreshMilk</h3>
            <div className="space-y-2 text-sm text-blue-100">
              <p className="flex items-start gap-2">
                <span className="material-symbols-outlined text-lg mt-0.5">location_on</span>
                <span>Số 10, Đường Tân Trào, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">call</span>
                <span>1900 6515</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">mail</span>
                <span>cskh@freshmilk.com.vn</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase mb-6 border-b border-blue-400/30 pb-2 inline-block">
              Về chúng tôi
            </h3>
            <ul className="space-y-3">
              <li>
                <p className="text-sm text-blue-100 hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Câu chuyện thương hiệu
                </p>
              </li>
              <li>
                <p className="text-sm text-blue-100 hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Sản phẩm
                </p>
              </li>
              <li>
                <p className="text-sm text-blue-100 hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Tin tức & Sự kiện
                </p>
              </li>
              <li>
                <p className="text-sm text-blue-100 hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Tuyển dụng
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase mb-6 border-b border-blue-400/30 pb-2 inline-block">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-3">
              <li>
                <p className="text-sm text-blue-100 hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Điều khoản sử dụng
                </p>
              </li>
              <li>
                <p className="text-sm text-blue-100 hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Chính sách bảo mật
                </p>
              </li>
              <li>
                <p className="text-sm text-blue-100 hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Chính sách giao hàng
                </p>
              </li>
              <li>
                <p className="text-sm text-blue-100 hover:text-white hover:translate-x-1 transition-all inline-block cursor-pointer">
                  Liên hệ
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase mb-6 border-b border-blue-400/30 pb-2 inline-block">
              Đăng ký nhận tin
            </h3>
            <p className="text-sm text-blue-100 mb-4">
              Nhận thông tin khuyến mãi mới nhất từ FreshMilk
            </p>
            <div className="flex bg-white rounded-lg overflow-hidden p-1 mb-6">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-3 py-2 text-gray-700 text-sm outline-none border-none placeholder-gray-400"
              />
              <button className="bg-[#1a3c7e] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#15326d] transition-colors">
                Gửi
              </button>
            </div>

            <div className="flex gap-4">
              {['facebook', 'youtube', 'tiktok', 'instagram'].map((social) => (
                <p key={social} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#1a3c7e] transition-all cursor-pointer">
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-blue-400/30 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-blue-200 text-center md:text-left">
            © 2024 Công Ty Cổ Phần Sữa FreshMilk Việt Nam. Mọi quyền được bảo lưu.
            <br className="hidden md:block" />
            Giấy CNĐKDN: 0300588569 - Ngày cấp: 20/11/2003, sửa đổi lần thứ 20 ngày 01/01/2024.
          </p>
          <div className="flex items-center gap-4">
            <img src="http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png" alt="Bo Cong Thuong" className="h-10 object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
}

