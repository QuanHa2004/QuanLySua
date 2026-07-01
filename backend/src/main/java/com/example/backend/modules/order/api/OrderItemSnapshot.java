package com.example.backend.modules.order.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemSnapshot {
    @JsonProperty("product_id")
    private Integer productId;

    @JsonProperty("product_name")
    private String productName;

    @JsonProperty("image_url")
    private String imageUrl;

    private BigDecimal price;
    private Integer quantity;

    @JsonProperty("total_item_amount")
    private BigDecimal totalItemAmount;
}
