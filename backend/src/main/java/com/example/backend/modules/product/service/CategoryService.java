package com.example.backend.modules.product.service;

import com.example.backend.modules.product.dto.request.CategoryRequest;
import com.example.backend.modules.product.dto.response.CategoryResponse;
import com.example.backend.modules.product.entity.Category;
import com.example.backend.modules.product.exception.CategoryAlreadyExistsException;
import com.example.backend.modules.product.repo.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Lấy danh sách danh mục và map sang DTO
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getId())
                        .categoryName(category.getName())
                        .build())
                .toList();
    }

    // Thêm danh mục mới
    @Transactional
    public void addCategory(CategoryRequest request) {
        // Validation kiểm tra trùng lặp (trả về lỗi 409 cho Frontend)
        if (categoryRepository.existsByName(request.getCategoryName().trim())) {
            throw new CategoryAlreadyExistsException("Tên danh mục này đã tồn tại!");
        }

        Category newCategory = Category.builder()
                .name(request.getCategoryName().trim())
                .build();

        categoryRepository.save(newCategory);
    }
}
