package com.example.backend.product.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class AdminProductResponse {
    @JsonProperty("product_id")
    private Integer productId;

    @JsonProperty("product_name")
    private String productName;

    @JsonProperty("is_hot")
    private Boolean isHot;

    @JsonProperty("is_deleted")
    private Boolean isDeleted;

    private List<VariantDto> variants;

    @Data
    @Builder
    public static class VariantDto {
        @JsonProperty("variant_name")
        private String variantName;

        private BigDecimal price;

        @JsonProperty("stock_quantity")
        private Integer stockQuantity; // Số lượng tồn kho dự phòng

        private List<BatchDto> batches;
    }

    @Data
    @Builder
    public static class BatchDto {
        @JsonProperty("expiration_date")
        private LocalDate expirationDate;

        private Integer quantity;
    }
}
