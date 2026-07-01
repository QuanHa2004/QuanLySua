package com.example.backend.modules.product.controller.customer;

import com.example.backend.modules.product.dto.response.CategoryResponse;
import com.example.backend.modules.product.service.customer.CustomerCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer/categories")
@RequiredArgsConstructor
public class CustomerCategoryController {

    private final CustomerCategoryService customerCategoryService;

    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        List<CategoryResponse> categories = customerCategoryService.getAllCategories();
        return ResponseEntity.ok(Map.of("data", categories));
    }
}