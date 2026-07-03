package com.example.backend.modules.order.event;

public record OrderDeliveredEvent(Integer orderId, Integer userId) {
}
