package com.example.backend.modules.product.repo;

import com.example.backend.modules.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsByName(String name);

    List<Product> findByCategoryId(Integer categoryId);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Product p SET p.quantity = p.quantity - :amount " +
            "WHERE p.id = :productId AND p.quantity >= :amount")
    int deductQuantity(@Param("productId") Integer productId, @Param("amount") Integer amount);
}
