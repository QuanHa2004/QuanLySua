package com.example.backend.product.repo;

import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
}
