package com.example.backend.product.repo;

import com.example.backend.product.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // Kiểm tra xem tên danh mục đã tồn tại chưa (tránh lỗi Duplicate Key dưới DB)
    boolean existsByName(String name);
}
