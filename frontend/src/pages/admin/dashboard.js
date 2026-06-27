import SideBar from "../../component/side-bar";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [report, setReport] = useState({
    total_revenue: 0,
    total_orders: 0,
    new_customer: 0,
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const revenueRes = await fetch("http://localhost:8080/admin/total-revenue");
        const revenueJson = await revenueRes.json();

        const customerRes = await fetch("http://localhost:8080/admin/new-customer");
        const customerJson = await customerRes.json();

        const revenueData = revenueJson.data || {};
        const customerData = customerJson.data || [];

        setReport({
          total_revenue: revenueData.total_revenue ?? 0,
          total_orders: revenueData.total_orders ?? 0,
          new_customer: customerData.length,
        });
      } catch (error) {
        console.error("Lỗi tải dữ liệu báo cáo:", error);
      }
    };

    fetchReport();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans">
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 translate-x-0">
        <SideBar />
      </div>

      <main className="flex-1 ml-64 p-8">
        <div className="w-full max-w-7xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#1a3c7e] tracking-tight uppercase">Tổng quan</h1>
            <p className="text-gray-500 text-sm mt-1">Báo cáo hoạt động kinh doanh hôm nay.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Doanh thu */}
            <div className="group relative flex flex-col justify-between rounded-2xl p-6 bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
                    Tổng doanh thu
                  </p>
                  <h3 className="text-3xl font-bold text-[#1a3c7e]">
                    {Number(report.total_revenue).toLocaleString('vi-VN')}
                  </h3>
                </div>
              </div>
            </div>

            {/* Card 2: Đơn hàng */}
            <div className="group relative flex flex-col justify-between rounded-2xl p-6 bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
                    Tổng đơn hàng
                  </p>
                  <h3 className="text-3xl font-bold text-[#1a3c7e]">
                    {Number(report.total_orders).toLocaleString('vi-VN')}
                  </h3>
                </div>
              </div>
            </div>

            {/* Card 3: Khách hàng */}
            <div className="group relative flex flex-col justify-between rounded-2xl p-6 bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
                    Khách hàng mới
                  </p>
                  <h3 className="text-3xl font-bold text-[#1a3c7e]">
                    {Number(report.new_customer).toLocaleString('vi-VN')}
                  </h3>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}