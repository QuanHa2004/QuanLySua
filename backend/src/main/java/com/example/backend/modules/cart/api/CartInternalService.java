package com.example.backend.modules.cart.api;

import java.math.BigDecimal;

public interface CartInternalService {
    BigDecimal calculateTotalCheckedItems(Integer userId);
}