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
@Slf4j
public class Cart_UserRegisteredListener {
    private final CartRepository cartRepository;

    @ApplicationModuleListener
    public void onUserRegistered(UserRegisteredEvent event) {
        log.info("➔ [Cart Module] Nhận sự kiện đăng ký mới từ User ID: {}", event.userId());

        // Kiểm tra an toàn: Đảm bảo chưa có giỏ hàng nào được tạo cho user này
        boolean exists = cartRepository.existsByUserId(event.userId());

        if (!exists) {
            Cart newCart = new Cart();
            newCart.setUserId(event.userId());
            cartRepository.save(newCart);

            log.info("➔ Đã khởi tạo giỏ hàng trống thành công cho User ID: {}", event.userId());
        } else {
            log.warn("➔ Giỏ hàng cho User ID: {} đã tồn tại từ trước!", event.userId());
        }
    }
}
