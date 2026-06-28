package com.example.backend.product.controller.customer;

import com.example.backend.product.dto.request.ProductFilterRequest;
import com.example.backend.product.dto.response.ProductDetailResponse;
import com.example.backend.product.dto.response.ProductFilterResponse;
import com.example.backend.product.ProductResponse;
import com.example.backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        try {
            List<ProductResponse> responseList = productService.getAllProducts();

            // Trả về JSON format: { "data": [...] } để khớp hoàn toàn với Frontend React
            return ResponseEntity.ok(Map.of("data", responseList));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Không thể tải danh sách sản phẩm"));
        }
    }


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


    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id") Integer id) {
        try {
            ProductDetailResponse response = productService.getProductDetail(id);

            // Trả thẳng object ra ngoài, KHÔNG bọc trong { "data": ... }
            // vì đoạn fetch của React đang là: setProduct(data)
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}