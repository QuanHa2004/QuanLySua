package com.example.backend.modules.order.enums;

public enum OrderStatus {
    PENDING,    // Chờ xác nhận
    PROCESSING, // Đang xử lý / Đóng gói
    SHIPPING,   // Đang giao hàng
    DELIVERED,  // Đã giao thành công
    CANCELLED   // Đã hủy
}