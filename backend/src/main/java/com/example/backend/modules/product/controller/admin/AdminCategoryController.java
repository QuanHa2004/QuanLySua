package com.example.backend.modules.product.controller.admin;

import com.example.backend.modules.product.dto.request.CategoryRequest;
import com.example.backend.modules.product.dto.response.CategoryResponse;
import com.example.backend.modules.product.exception.CategoryAlreadyExistsException;
import com.example.backend.modules.product.service.admin.AdminCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        List<CategoryResponse> categories = adminCategoryService.getAllCategories();
        return ResponseEntity.ok(Map.of("data", categories));
    }


    @PostMapping("/add")
    public ResponseEntity<?> addCategory(@Valid @RequestBody CategoryRequest request) {
        try {
            adminCategoryService.addCategory(request);
            return ResponseEntity.ok(Map.of("message", "Thêm danh mục thành công!"));

        } catch (CategoryAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Lỗi dữ liệu không hợp lệ"));
        }
    }
}