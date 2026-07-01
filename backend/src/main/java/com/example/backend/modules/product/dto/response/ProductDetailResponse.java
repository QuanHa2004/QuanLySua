package com.example.backend.modules.product.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ProductDetailResponse {
    @JsonProperty("product_id")
    private Integer productId;

    @JsonProperty("product_name")
    private String productName;

    @JsonProperty("description")
    private String description;

    @JsonProperty("price")
    private BigDecimal price;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("quantity")
    private Integer quantity;

    @JsonProperty("expiration_date")
    private LocalDate expirationDate;

    @JsonProperty("category_name")
    private String categoryName;

    @JsonProperty("ingredients")
    private String ingredients;

    @JsonProperty("usage_instruction")
    private String usageInstruction;

    @JsonProperty("calories")
    private BigDecimal calories;

    @JsonProperty("protein")
    private BigDecimal protein;

    @JsonProperty("fat")
    private BigDecimal fat;

    @JsonProperty("carbs")
    private BigDecimal carbs;

    @JsonProperty("vitamins")
    private String vitamins;

    @JsonProperty("minerals")
    private String minerals;
}
