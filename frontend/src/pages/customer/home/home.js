import Footer from '../../../component/footer';
import Header from '../../../component/header';
import { useNavigate } from 'react-router-dom';

// Icon SVG đơn giản cho phần Giá trị cốt lõi
const QualityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#1a3c7e]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
  </svg>
);

const NatureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#1a3c7e]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
  </svg>
);

const TechIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#1a3c7e]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66c.34-.85.72-1.667 1.137-2.433a9.912 9.912 0 0 1 2.48-2.636.96.96 0 0 1 1.48.514c.159.967.067 2.05-.28 3.197a19.13 19.13 0 0 1-4.817 1.359m0 0a23.848 23.848 0 0 0 8.835-2.535m-8.835 2.535a23.848 23.848 0 0 1-8.835 2.535" />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white font-sans text-[#333]">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex h-full grow flex-col">
          <Header />

          <main className="flex-1">
            <section className="w-full relative h-[500px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-600">
              </div>

              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="container mx-auto px-4">
                  <span className="text-blue-200 font-semibold tracking-widest uppercase mb-4 block">Về Chúng Tôi</span>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    Hành Trình Mang Nguồn Sữa Việt <br /> Vươn Tầm Thế Giới
                  </h1>
                  <p className="text-white text-lg max-w-2xl mx-auto opacity-90">
                    Hơn 45 năm hình thành và phát triển, chúng tôi tự hào mang đến nguồn dinh dưỡng thuần khiết nhất cho hàng triệu gia đình Việt Nam.
                  </p>
                </div>
              </div>
            </section>

            <section className="py-20 bg-white">
              <div className="container mx-auto px-4 md:px-10 lg:px-20">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="w-full md:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      <div className="aspect-[4/3] items-center justify-center text-gray-400">
                        <img src="/images/banner.jpg" alt="About Us" className="w-full h-full object-cover opacity-100" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                    <h2 className="text-[#1a3c7e] text-3xl md:text-4xl font-bold uppercase tracking-wide">
                      Khởi Nguồn Từ Thiên Nhiên
                    </h2>
                    <div className="w-20 h-1 bg-[#1a3c7e] rounded-full"></div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Câu chuyện của chúng tôi bắt đầu từ những cánh đồng cỏ xanh mướt trải dài, nơi những chú bò sữa hạnh phúc được chăm sóc bằng tất cả tình yêu thương.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Chúng tôi tin rằng, chỉ có nguồn nguyên liệu thuần khiết nhất mới tạo nên những giọt sữa thơm ngon, giàu dinh dưỡng. Với quy trình sản xuất khép kín "Từ đồng cỏ xanh đến ly sữa trắng", chúng tôi cam kết chất lượng tuyệt đối trong từng sản phẩm.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 bg-[#f4f7fc]">
              <div className="container mx-auto px-4 md:px-10 lg:px-20">
                <div className="text-center mb-16">
                  <h2 className="text-[#1a3c7e] text-3xl md:text-4xl font-bold uppercase tracking-wide mb-3">
                    Giá Trị Cốt Lõi
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Những nguyên tắc vàng giúp chúng tôi vững bước trên hành trình chinh phục niềm tin khách hàng.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group">
                    <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <QualityIcon />
                    </div>
                    <h3 className="text-xl font-bold text-[#1a3c7e] mb-3">Chất Lượng Quốc Tế</h3>
                    <p className="text-gray-500">
                      Tuân thủ nghiêm ngặt các tiêu chuẩn an toàn thực phẩm quốc tế ISO, HACCP để đảm bảo an toàn tuyệt đối.
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group">
                    <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <NatureIcon />
                    </div>
                    <h3 className="text-xl font-bold text-[#1a3c7e] mb-3">100% Tự Nhiên</h3>
                    <p className="text-gray-500">
                      Không chất bảo quản, không dư lượng kháng sinh, giữ trọn hương vị tươi ngon từ thiên nhiên.
                    </p>
                  </div>

                  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 text-center group">
                    <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <TechIcon />
                    </div>
                    <h3 className="text-xl font-bold text-[#1a3c7e] mb-3">Công Nghệ Hiện Đại</h3>
                    <p className="text-gray-500">
                      Hệ thống dây chuyền sản xuất tự động hóa tiên tiến nhất thế giới, giữ trọn vi chất dinh dưỡng.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16 bg-[#1a3c7e] text-white">
              <div className="container mx-auto px-4 md:px-10 lg:px-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-800/50">
                  <div>
                    <div className="text-4xl md:text-5xl font-bold mb-2">45+</div>
                    <div className="text-blue-200 text-sm md:text-base">Năm Hình Thành</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold mb-2">13</div>
                    <div className="text-blue-200 text-sm md:text-base">Trang Trại Chuẩn Global GAP</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold mb-2">250+</div>
                    <div className="text-blue-200 text-sm md:text-base">Sản Phẩm Đa Dạng</div>
                  </div>
                  <div>
                    <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                    <div className="text-blue-200 text-sm md:text-base">Quốc Gia Xuất Khẩu</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 bg-white">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-[#1a3c7e] mb-6">Bạn đã sẵn sàng trải nghiệm?</h2>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                  Hãy để chúng tôi chăm sóc sức khỏe cho gia đình bạn mỗi ngày bằng những sản phẩm dinh dưỡng tốt nhất.
                </p>
                <button onClick={() => navigate('/products')}
                  className="bg-[#1a3c7e] text-white px-10 py-4 rounded-full font-bold hover:bg-[#15326d] hover:shadow-lg transition-all duration-300">
                  Khám Phá Sản Phẩm Ngay
                </button>
              </div>
            </section>

          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}