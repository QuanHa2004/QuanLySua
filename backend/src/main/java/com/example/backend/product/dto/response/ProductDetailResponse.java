package com.example.backend.product.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

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

    @JsonProperty("category_name")
    private String categoryName;

    // --- Thông tin chi tiết & dinh dưỡng (từ bảng ProductDetail) ---
    // (Phục vụ cho component <NutrientSection />)

    @JsonProperty("ingredients")
    private String ingredients;

    @JsonProperty("usage_instruction")
    private String usageInstruction; // Cột `usage` mà chúng ta đã đổi tên lúc trước

    // Các chỉ số vĩ mô (Macros)
    @JsonProperty("calories")
    private BigDecimal calories;

    @JsonProperty("protein")
    private BigDecimal protein;

    @JsonProperty("fat")
    private BigDecimal fat;

    @JsonProperty("carbs")
    private BigDecimal carbs;

    // JSON String chứa Vitamin và Khoáng chất
    @JsonProperty("vitamins")
    private String vitamins;

    @JsonProperty("minerals")
    private String minerals;
}
