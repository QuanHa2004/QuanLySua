package com.example.backend.product.controller.customer;

import com.example.backend.product.dto.request.ProductFilterRequest;
import com.example.backend.product.dto.response.ProductFilterResponse;
import com.example.backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    @PostMapping("/filter")
    public ResponseEntity<?> filterProducts(@RequestBody ProductFilterRequest request) {
        try {
            List<ProductFilterResponse> responseList = productService.filterProducts(request);

            // Trả về JSON bọc trong key "data" khớp hoàn toàn với code React
            return ResponseEntity.ok(Map.of("data", responseList));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lọc sản phẩm"));
        }
    }
}