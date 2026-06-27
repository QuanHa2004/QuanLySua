package com.example.backend.cart.entity;

import java.io.Serializable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class CartItemPK implements Serializable {
    private Integer cartId;
    private Integer productId;
}
