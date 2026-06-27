import { useNavigate } from "react-router-dom";
import SideBar from "../../../component/side-bar";
import ManufacturerList from "./manufacturer-list";

export default function ManufacturerManagement() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen bg-[#f8f9fa] font-sans">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="ml-64 flex flex-row min-h-screen">

          <div className="fixed inset-y-0 left-0 z-50 w-64">
            <SideBar />
          </div>

          <main className="flex-1 p-8 w-full">
            <div className="w-full max-w-7xl mx-auto">

              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex min-w-72 flex-col gap-1">
                  <p className="text-[#1a3c7e] text-3xl font-black tracking-tight uppercase">
                    Quản lý nhà sản xuất
                  </p>
                  <p className="text-gray-500 text-sm">
                    Danh sách các đơn vị sản xuất và nguồn gốc sản phẩm.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/admin/add-manufacturer')}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1a3c7e] text-white text-sm font-bold tracking-wide hover:bg-[#15326d] hover:-translate-y-0.5 transition-all shadow-md shadow-blue-100"
                >
                  <span className="truncate flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Thêm nhà sản xuất
                  </span>
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <ManufacturerList />
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}