package com.example.backend.modules.product.service;

import com.example.backend.modules.product.api.ProductInternalService;
import com.example.backend.modules.product.api.ProductResponse;
import com.example.backend.modules.product.entity.Product;
import com.example.backend.modules.product.repo.ProductRepository;
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
                .productName(product.getName())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .build();
    }
}
