package com.example.backend.modules.order.api;

import java.util.List;

public interface OrderInternalService {

    Integer getUserIdByOrderId(Integer orderId);

    List<OrderItemSnapshot> getOrderItems(Integer orderId);
}