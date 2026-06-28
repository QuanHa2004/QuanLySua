package com.example.backend.modules.cart.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_item")
@IdClass(CartItemPK.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @Column(name = "cart_id")
    private Integer cartId;

    @Id
    @Column(name = "product_id")
    private Integer productId;

    // Map lại Object Cart để lấy thông tin dễ dàng (nằm cùng module Cart)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", insertable = false, updatable = false)
    private Cart cart;

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(name = "is_checked")
    private Boolean isChecked = false;
}