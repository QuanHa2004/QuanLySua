package com.example.backend.modules.order.api;

import java.util.List;

public interface OrderInternalService {
    // Trả về ID của người dùng dựa vào ID của đơn hàng
    Integer getUserIdByOrderId(Integer orderId);
    List<OrderItemSnapshot> getOrderItems(Integer orderId);
}