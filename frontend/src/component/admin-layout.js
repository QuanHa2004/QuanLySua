import { Outlet } from "react-router-dom";
import SideBar from "./side-bar"; // Import SideBar hiện tại của bạn

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SideBar luôn cố định ở đây, không bao giờ bị render lại khi chuyển trang */}
      <SideBar />
      
      {/* Phần nội dung bên phải. ml-64 tương ứng với w-64 của SideBar để đẩy nội dung sang phải */}
      <main className="flex-1 ml-64 p-8">
         <Outlet /> {/* Các trang như Dashboard, Order, Product... sẽ được nhúng vào đây */}
      </main>
    </div>
  );
}