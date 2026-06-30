package com.example.backend.modules.cart.listener;

import com.example.backend.modules.cart.repo.CartItemRepository;
import com.example.backend.modules.order.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class Cart_OrderCreatedListener {
    private final CartItemRepository cartItemRepository;

    @ApplicationModuleListener // Lắng nghe không đồng bộ, cực kỳ an toàn
    public void onOrderCreated(OrderCreatedEvent event) {
        log.info("➔ [Cart Module] Nhận được tín hiệu đơn hàng #{} đã tạo. Tiến hành dọn giỏ hàng của User ID: {}",
                event.orderId(), event.userId());

        // Gọi hàm xóa các item đã checkout
        cartItemRepository.clearCheckedItems(event.userId());

        log.info("➔ [Cart Module] Dọn giỏ hàng thành công!");
    }
}
