package com.example.backend.modules.cart.api;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemSnapshot {
    Integer productId;
    String productName;
    BigDecimal price;
    Integer quantity;
    BigDecimal totalItemAmount;
}
