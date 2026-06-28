package com.example.backend.modules.cart.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartResponse {
    @JsonProperty("product_id")
    private Integer productId;

    @JsonProperty("product_name")
    private String productName;

    @JsonProperty("price")
    private BigDecimal price;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("quantity")
    private Integer quantity;

    @JsonProperty("is_checked")
    private Boolean isChecked;
}
