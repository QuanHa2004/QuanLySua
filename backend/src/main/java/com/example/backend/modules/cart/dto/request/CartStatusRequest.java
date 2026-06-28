package com.example.backend.modules.cart.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CartStatusRequest {
    @JsonProperty("is_checked")
    private Boolean isChecked;
}
