package com.example.backend.product;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductResponse {
    private Integer productId;
    private String name;
    private BigDecimal price;
}
