package com.example.backend.modules.shipping.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeliveryEstimate {
    private Double distanceKm;
    private Double durationMinutes;
    private String estimatedDeliveryDate;
}