package com.example.backend.modules.cart.listener;

import com.example.backend.modules.cart.repo.CartItemRepository;
import com.example.backend.modules.order.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Cart_OrderCreatedListener {
    private final CartItemRepository cartItemRepository;

    @ApplicationModuleListener
    public void onOrderCreated(OrderCreatedEvent event) {
        cartItemRepository.clearCheckedItems(event.userId());
    }
}
