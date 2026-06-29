package com.example.backend.modules.cart.repo;

import com.example.backend.modules.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartId(Integer cartId);

    Optional<CartItem> findByCartIdAndProductId(Integer cartId, Integer productId);

    void deleteByCartIdAndProductId(Integer cartId, Integer productId);


    @Modifying
    @Query("UPDATE CartItem c SET c.isChecked = :isChecked WHERE c.cartId = :cartId")
    void updateStatusByCartId(@Param("cartId") Integer cartId, @Param("isChecked") Boolean isChecked);


    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.cartId = :cartId AND c.isChecked = true")
    void deleteCheckedItemsByCartId(@Param("cartId") Integer cartId);


    @Query("SELECT COALESCE(SUM(p.price * c.quantity), 0) " +
            "FROM CartItem c " +
            "JOIN Product p ON c.productId = p.id " +
            "WHERE c.cartId = :cartId AND c.isChecked = true")
    BigDecimal calculateTotalCheckedItems(@Param("cartId") Integer cartId);
}
