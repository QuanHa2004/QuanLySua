package com.example.backend.modules.order.dto.resquest;

import lombok.Data;

@Data
public class ShipOrderRequest {
    String customerLng;
    String customerLat;
}
