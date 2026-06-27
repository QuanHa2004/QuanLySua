package com.example.backend.product.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Vui lòng nhập tên danh mục")
    @JsonProperty("category_name")
    private String categoryName;
}
