package com.example.backend.modules.product.repo;

import com.example.backend.modules.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsByName(String name);

    // Tìm tất cả sản phẩm thuộc 1 danh mục cụ thể
    List<Product> findByCategoryId(Integer categoryId);
}
