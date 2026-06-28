package com.example.backend.product.service;

import com.example.backend.product.ProductInternalService;
import com.example.backend.product.ProductResponse;
import com.example.backend.product.entity.Product;
import com.example.backend.product.repo.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductInternalServiceImpl implements ProductInternalService {

    private final ProductRepository productRepository;

    // Hàm này được thiết kế riêng để các module khác (như cart, order) gọi vào
    public ProductResponse getProductSnapshot(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

        return ProductResponse.builder()
                .productId(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .build();
    }
}
