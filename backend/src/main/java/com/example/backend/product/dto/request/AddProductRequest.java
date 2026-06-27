package com.example.backend.product.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Data
public class AddProductRequest {
    // --- BẢNG PRODUCT ---
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @JsonProperty("product_name")
    private String productName;

    @NotNull(message = "Vui lòng chọn danh mục")
    @JsonProperty("category_id")
    private Integer categoryId;

    @NotNull(message = "Vui lòng nhập giá bán")
    private BigDecimal price;

    @NotNull(message = "Vui lòng nhập số lượng")
    private Integer quantity;

    @JsonProperty("expiration_date")
    private LocalDate expirationDate; // Định dạng YYYY-MM-DD từ FE gửi lên

    @JsonProperty("discount_percent")
    private Integer discountPercent = 0;

    @JsonProperty("image_url")
    private String imageUrl;

    private String description;

    @JsonProperty("is_hot")
    private Integer isHot = 0;

    // --- BẢNG PRODUCT DETAIL ---
    private String origin;
    private String ingredients;
    private String usage;
    private String storage;

    @JsonProperty("other_nutrients")
    private String otherNutrients;

    // Dùng BigDecimal để map chính xác với Entity của bạn
    private BigDecimal calories;
    private BigDecimal protein;
    private BigDecimal fat;
    private BigDecimal carbohydrates;
    private BigDecimal sugar;

    // Vi lượng dạng JSON
    private Map<String, String> vitamins;
    private Map<String, String> minerals;
}
