package com.example.backend.modules.order.api;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemSnapshot {
    Integer productId;
    Integer quantity;
}
