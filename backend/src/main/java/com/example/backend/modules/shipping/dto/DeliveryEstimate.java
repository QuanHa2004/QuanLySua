package com.example.backend.modules.shipping.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeliveryEstimate {
    private Double distanceKm; // Quãng đường (km)
    private Double durationMinutes; // Thời gian đi dự kiến (phút)
    private String estimatedDeliveryDate; // Chuỗi ngày giờ hiển thị
}