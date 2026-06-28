package com.example.backend.modules.product.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ProductFilterRequest {
    @JsonProperty("category_id")
    private Integer categoryId;
}
