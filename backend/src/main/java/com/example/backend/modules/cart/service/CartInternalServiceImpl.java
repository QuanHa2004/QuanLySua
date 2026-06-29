package com.example.backend.modules.cart.service;

import com.example.backend.modules.cart.api.CartInternalService;
import com.example.backend.modules.cart.repo.CartItemRepository;
import com.example.backend.modules.order.api.OrderInternalService;
import com.example.backend.modules.order.repo.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartInternalServiceImpl implements CartInternalService {

    private final CartItemRepository cartItemRepository;

    @Override
    public BigDecimal calculateTotalCheckedItems(Integer userId){
        return cartItemRepository.calculateTotalCheckedItems(userId);
    }
}
