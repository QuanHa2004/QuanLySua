
import UserList from "./user-list";

export default function UserManagement() {

  return (
    <div className="relative flex min-h-screen bg-[#f8f9fa] font-sans">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="flex flex-row min-h-screen">


          <main className="flex-1 p-8 w-full">
            <div className="w-full max-w-7xl mx-auto">

              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex min-w-72 flex-col gap-1">
                  <p className="text-[#1a3c7e] text-3xl font-black tracking-tight uppercase">
                    Quản lý người dùng
                  </p>
                  <p className="text-gray-500 text-sm">
                    Kiểm soát thông tin khách hàng và phân quyền tài khoản.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <UserList />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}