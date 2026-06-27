package com.example.backend.product.controller.admin;

import com.example.backend.product.dto.request.CategoryRequest;
import com.example.backend.product.dto.response.CategoryResponse;
import com.example.backend.product.exception.CategoryAlreadyExistsException;
import com.example.backend.product.service.CategoryService;
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

    private final CategoryService categoryService;


    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        // Trả về object có field "data" chứa mảng
        return ResponseEntity.ok(Map.of("data", categories));
    }


    @PostMapping("/add")
    public ResponseEntity<?> addCategory(@Valid @RequestBody CategoryRequest request) {
        try {
            categoryService.addCategory(request);
            // Thành công trả về 200 OK kèm message
            return ResponseEntity.ok(Map.of("message", "Thêm danh mục thành công!"));

        } catch (CategoryAlreadyExistsException e) {
            // Trùng lặp trả về 409 Conflict
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            // Lỗi hệ thống trả về 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Lỗi dữ liệu không hợp lệ"));
        }
    }
}