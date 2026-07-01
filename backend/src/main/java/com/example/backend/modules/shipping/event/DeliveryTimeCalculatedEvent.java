package com.example.backend.modules.shipping.event;

public record DeliveryTimeCalculatedEvent(Integer orderId, Integer estimatedMinutes) {
}
