package com.example.backend.modules.product.service.customer;

import com.example.backend.modules.product.dto.response.CategoryResponse;
import com.example.backend.modules.product.repo.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerCategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> CategoryResponse.builder()
                        .categoryId(category.getId())
                        .categoryName(category.getName())
                        .build())
                .toList();
    }
}
