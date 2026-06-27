package com.example.backend.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_detail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetail {

    @Id
    @Column(name = "product_id")
    private Integer productId;

    // Quan hệ 1-1 với Product (cùng module) nhưng mapping qua cột product_id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "product_id", referencedColumnName = "product_id", insertable = false, updatable = false),
            // Do Product có khóa kép, nếu ProductDetail cũng cần map đúng bản ghi thì cần thêm cấu hình.
            // Tuy nhiên theo DB của bạn, ProductDetail chỉ link theo product_id.
            // Đây là điểm bạn cần lưu ý kiểm tra lại logic database nếu Product có nhiều expiration_date cho cùng 1 product_id.
    })
    private Product product;

    @Column(name = "origin")
    private String origin;

    @Column(columnDefinition = "TEXT")
    private String ingredients;

    @Column(name = "`usage`", columnDefinition = "TEXT")
    private String usage;

    @Column(columnDefinition = "TEXT")
    private String storage;

    @Column(precision = 5, scale = 2)
    private BigDecimal calories;

    @Column(precision = 5, scale = 2)
    private BigDecimal protein;

    @Column(precision = 5, scale = 2)
    private BigDecimal fat;

    @Column(precision = 5, scale = 2)
    private BigDecimal carbohydrates;

    @Column(precision = 5, scale = 2)
    private BigDecimal sugar;

    @Column(columnDefinition = "json")
    private String vitamins; // Lưu dưới dạng chuỗi JSON String

    @Column(columnDefinition = "json")
    private String minerals; // Lưu dưới dạng chuỗi JSON String

    @Column(name = "other_nutrients", columnDefinition = "TEXT")
    private String otherNutrients;
}
