package com.example.backend.modules.cart.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CartRequest {
    @JsonProperty("product_id")
    private Integer productId;

    private Integer quantity;
}
