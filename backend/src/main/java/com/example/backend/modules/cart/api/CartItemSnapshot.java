package com.example.backend.modules.cart.api;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemSnapshot {
    Integer productId;
    String productName;
    BigDecimal price; // Giá tại thời điểm hiện tại (đã trừ discount nếu có)
    Integer quantity;
    BigDecimal totalItemAmount;
}
