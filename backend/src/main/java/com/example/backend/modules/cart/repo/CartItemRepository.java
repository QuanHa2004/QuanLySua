package com.example.backend.modules.cart.repo;

import com.example.backend.modules.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartId(Integer cartId);

    Optional<CartItem> findByCartIdAndProductId(Integer cartId, Integer productId);

    void deleteByCartIdAndProductId(Integer cartId, Integer productId);


    @Modifying
    @Query("UPDATE CartItem c SET c.isChecked = :isChecked WHERE c.cartId = :cartId")
    void updateStatusByCartId(@Param("cartId") Integer cartId, @Param("isChecked") Boolean isChecked);
}
