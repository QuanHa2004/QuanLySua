package com.example.backend.modules.product.controller.customer;

import com.example.backend.modules.product.dto.response.ProductResponse;
import com.example.backend.modules.product.dto.request.ProductFilterRequest;
import com.example.backend.modules.product.dto.response.ProductDetailResponse;
import com.example.backend.modules.product.dto.response.ProductFilterResponse;
import com.example.backend.modules.product.service.admin.AdminProductService;
import com.example.backend.modules.product.service.customer.CustomerProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer/products")
@RequiredArgsConstructor
public class CustomerProductController {

    private final CustomerProductService customerProductService;

    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            List<ProductResponse> responseList = customerProductService.getAllProducts();

            return ResponseEntity.ok(Map.of("data", responseList));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Không thể tải danh sách sản phẩm"));
        }
    }


    @PostMapping("/filter")
    public ResponseEntity<?> filterProducts(@RequestBody ProductFilterRequest request) {
        try {
            List<ProductFilterResponse> responseList = customerProductService.filterProducts(request);

            return ResponseEntity.ok(Map.of("data", responseList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi lọc sản phẩm"));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id") Integer id) {
        try {
            ProductDetailResponse response = customerProductService.getProductDetail(id);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}