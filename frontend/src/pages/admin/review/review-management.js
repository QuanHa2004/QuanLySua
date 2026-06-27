import SideBar from "../../../component/side-bar";
import ReviewList from "./review-list";

export default function ReviewManagement() {

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
                    Quản lý đánh giá
                  </p>
                  <p className="text-gray-500 text-sm">
                    Kiểm soát phản hồi và đánh giá từ khách hàng.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <ReviewList />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}