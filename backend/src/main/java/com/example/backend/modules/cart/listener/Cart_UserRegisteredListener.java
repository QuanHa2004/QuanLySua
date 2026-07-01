package com.example.backend.modules.cart.listener;

import com.example.backend.modules.cart.entity.Cart;
import com.example.backend.modules.cart.repo.CartRepository;
import com.example.backend.modules.user.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Cart_UserRegisteredListener {
    private final CartRepository cartRepository;

    @ApplicationModuleListener
    public void onUserRegistered(UserRegisteredEvent event) {
        boolean exists = cartRepository.existsByUserId(event.userId());

        if (!exists) {
            Cart newCart = new Cart();
            newCart.setUserId(event.userId());
            cartRepository.save(newCart);
        }
    }
}
