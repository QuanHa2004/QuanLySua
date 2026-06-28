package com.example.backend.modules.cart.entity;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CartItemPK implements Serializable {
    private Integer cartId;
    private Integer productId;
}
