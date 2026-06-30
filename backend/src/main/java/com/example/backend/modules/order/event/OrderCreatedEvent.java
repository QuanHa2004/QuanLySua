package com.example.backend.modules.order.event;

public record OrderCreatedEvent(Integer orderId, Integer userId) {
}
