package com.example.backend.modules.cart.service;

import com.example.backend.modules.cart.api.CartInternalService;
import com.example.backend.modules.cart.api.CartItemSnapshot;
import com.example.backend.modules.cart.repo.CartItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartInternalServiceImpl implements CartInternalService {

    private final CartItemRepository cartItemRepository;

    @Override
    public List<CartItemSnapshot> getCheckedItemsSnapshot(Integer userId){
        return cartItemRepository.getCheckedItemsSnapshot(userId);
    }
}
