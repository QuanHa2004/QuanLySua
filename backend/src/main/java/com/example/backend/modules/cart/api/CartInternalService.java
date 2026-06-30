package com.example.backend.modules.cart.api;

import java.util.List;

public interface CartInternalService {
    List<CartItemSnapshot> getCheckedItemsSnapshot(Integer userId);
}