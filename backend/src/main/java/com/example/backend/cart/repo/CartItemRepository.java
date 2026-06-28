package com.example.backend.cart.repo;

import com.example.backend.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartId(Integer cartId);

    Optional<CartItem> findByCartIdAndProductId(Integer cartId, Integer productId);

    void deleteByCartIdAndProductId(Integer cartId, Integer productId);
}
