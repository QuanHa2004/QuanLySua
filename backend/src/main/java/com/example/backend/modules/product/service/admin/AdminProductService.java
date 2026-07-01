package com.example.backend.modules.product.service.admin;

import com.example.backend.modules.product.dto.request.AddProductRequest;
import com.example.backend.modules.product.dto.response.AdminProductResponse;
import com.example.backend.modules.product.entity.Category;
import com.example.backend.modules.product.entity.Product;
import com.example.backend.modules.product.entity.ProductDetail;
import com.example.backend.modules.product.repo.ProductDetailRepository;
import com.example.backend.modules.product.repo.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ObjectMapper objectMapper;

    public List<AdminProductResponse> getAllProductsForAdmin() {
        return productRepository.findAll().stream().map(product -> {

            List<AdminProductResponse.BatchDto> batchList = new ArrayList<>();
            batchList.add(AdminProductResponse.BatchDto.builder()
                    .expirationDate(product.getExpirationDate())
                    .quantity(product.getQuantity())
                    .build());

            List<AdminProductResponse.VariantDto> variantList = new ArrayList<>();
            variantList.add(AdminProductResponse.VariantDto.builder()
                    .variantName(product.getName())
                    .price(product.getPrice())
                    .stockQuantity(product.getQuantity())
                    .batches(batchList)
                    .build());

            return AdminProductResponse.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .isHot(product.getIsHot() != null && product.getIsHot())
                    .isDeleted(product.getIsDeleted() != null && product.getIsDeleted())
                    .variants(variantList)
                    .build();
        }).toList();
    }


    @Transactional(rollbackFor = Exception.class)
    public void addProduct(AddProductRequest request) {

        if (productRepository.existsByName(request.getProductName().trim())) {
            throw new IllegalArgumentException("DUPLICATE_PRODUCT");
        }

        Category categoryRef = new Category();
        categoryRef.setId(request.getCategoryId());

        Product product = new Product();
        product.setName(request.getProductName().trim());
        product.setCategory(categoryRef);
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setDiscountPercent(request.getDiscountPercent());

        product.setExpirationDate(request.getExpirationDate() != null ? request.getExpirationDate() : LocalDate.now().plusYears(1));

        product.setImageUrl(request.getImageUrl());
        product.setDescription(request.getDescription());
        product.setIsHot(request.getIsHot() == 1);
        product.setIsDeleted(false);

        Product savedProduct = productRepository.save(product);

        try {
            String vitaminsJson = request.getVitamins() != null ? objectMapper.writeValueAsString(request.getVitamins()) : "{}";
            String mineralsJson = request.getMinerals() != null ? objectMapper.writeValueAsString(request.getMinerals()) : "{}";

            ProductDetail detail = new ProductDetail();
            detail.setProductId(savedProduct.getId());

            detail.setOrigin(request.getOrigin());
            detail.setIngredients(request.getIngredients());
            detail.setUsage(request.getUsage());
            detail.setStorage(request.getStorage());
            detail.setOtherNutrients(request.getOtherNutrients());

            detail.setCalories(request.getCalories());
            detail.setProtein(request.getProtein());
            detail.setFat(request.getFat());
            detail.setCarbohydrates(request.getCarbohydrates());
            detail.setSugar(request.getSugar());

            detail.setVitamins(vitaminsJson);
            detail.setMinerals(mineralsJson);

            productDetailRepository.save(detail);

        } catch (Exception e) {
            log.error("Lỗi parse JSON thành phần dinh dưỡng", e);
            throw new IllegalArgumentException("Dữ liệu Vitamin/Khoáng chất không hợp lệ");
        }
    }
}
