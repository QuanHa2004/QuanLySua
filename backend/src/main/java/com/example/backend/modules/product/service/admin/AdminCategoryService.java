package com.example.backend.modules.product.service.admin;

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
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getId())
                        .categoryName(category.getName())
                        .build())
                .toList();
    }

    @Transactional
    public void addCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getCategoryName().trim())) {
            throw new CategoryAlreadyExistsException("Tên danh mục này đã tồn tại!");
        }

        Category newCategory = Category.builder()
                .name(request.getCategoryName().trim())
                .build();

        categoryRepository.save(newCategory);
    }
}
