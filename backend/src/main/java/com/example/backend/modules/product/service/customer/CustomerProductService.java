package com.example.backend.modules.product.service.customer;

import com.example.backend.modules.product.dto.request.ProductFilterRequest;
import com.example.backend.modules.product.dto.response.ProductDetailResponse;
import com.example.backend.modules.product.dto.response.ProductFilterResponse;
import com.example.backend.modules.product.dto.response.ProductResponse;
import com.example.backend.modules.product.entity.Product;
import com.example.backend.modules.product.entity.ProductDetail;
import com.example.backend.modules.product.repo.ProductDetailRepository;
import com.example.backend.modules.product.repo.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerProductService {

    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;

    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();

        return products.stream()
                .filter(p -> p.getIsDeleted() == null || !p.getIsDeleted())
                .map(p -> {
                    String catName = p.getCategory() != null ? p.getCategory().getName() : "Chưa phân loại";

                    return ProductResponse.builder()
                            .productId(p.getId())
                            .productName(p.getName())
                            .price(p.getPrice())
                            .imageUrl(p.getImageUrl())
                            .build();
                }).collect(Collectors.toList());
    }

    public List<ProductFilterResponse> filterProducts(ProductFilterRequest request) {
        List<Product> products;

        if (request.getCategoryId() == null) {
            products = productRepository.findAll();
        } else {
            products = productRepository.findByCategoryId(request.getCategoryId());
        }

        return products.stream().map(p -> {

            String catName = (p.getCategory() != null) ? p.getCategory().getName() : "Chưa phân loại";

            return ProductFilterResponse.builder()
                    .productId(p.getId())
                    .productName(p.getName())
                    .categoryName(catName)
                    .price(p.getPrice())
                    .imageUrl(p.getImageUrl())
                    .quantity(p.getQuantity())
                    .expirationDate(p.getExpirationDate())

                    .build();
        }).collect(Collectors.toList());
    }

    public ProductDetailResponse getProductDetail(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + productId));

        String categoryName = product.getCategory() != null ? product.getCategory().getName() : "Khác";

        ProductDetail detail = productDetailRepository.findById(productId).orElse(null);

        var responseBuilder = ProductDetailResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .quantity(product.getQuantity())
                .expirationDate(product.getExpirationDate())
                .categoryName(categoryName);

        if (detail != null) {
            responseBuilder
                    .ingredients(detail.getIngredients())
                    .usageInstruction(detail.getUsage())
                    .calories(detail.getCalories())
                    .protein(detail.getProtein())
                    .fat(detail.getFat())
                    .carbs(detail.getCarbohydrates())
                    .vitamins(detail.getVitamins())
                    .minerals(detail.getMinerals());
        }

        return responseBuilder.build();
    }
}
