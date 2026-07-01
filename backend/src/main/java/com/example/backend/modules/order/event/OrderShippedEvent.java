package com.example.backend.modules.order.event;

public record OrderShippedEvent(Integer orderId, String customerLng, String customerLat) {
}
