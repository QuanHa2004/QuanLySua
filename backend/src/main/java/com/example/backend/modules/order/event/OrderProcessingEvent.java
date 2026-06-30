package com.example.backend.modules.order.event;

public record OrderProcessingEvent(Integer orderId, Integer userId) {
}
