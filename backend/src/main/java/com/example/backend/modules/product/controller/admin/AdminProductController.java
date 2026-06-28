package com.example.backend.modules.product.controller.admin;

import com.example.backend.modules.product.dto.request.AddProductRequest;
import com.example.backend.modules.product.dto.response.AdminProductResponse;
import com.example.backend.modules.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<?> getAdminProductList() {
        try {
            List<AdminProductResponse> productList = productService.getAllProductsForAdmin();
            // Trả về cấu trúc JSON dạng { "data": [...] }
            return ResponseEntity.ok(Map.of("data", productList));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không thể lấy danh sách sản phẩm"));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@Valid @RequestBody AddProductRequest request) {
        try {
            productService.addProduct(request);
            return ResponseEntity.ok(Map.of("message", "Thêm sản phẩm thành công!"));

        } catch (IllegalArgumentException e) {
            if (e.getMessage().equals("DUPLICATE_PRODUCT")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("message", "Tên sản phẩm này đã tồn tại!"));
            }
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Lỗi hệ thống: " + e.getMessage()));
        }
    }
}