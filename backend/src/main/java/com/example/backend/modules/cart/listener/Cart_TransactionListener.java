package com.example.backend.modules.cart.listener;

import com.example.backend.modules.cart.repo.CartItemRepository;
import com.example.backend.modules.cart.repo.CartRepository;
import com.example.backend.modules.order.api.OrderInternalService;
import com.example.backend.modules.payment.event.TransactionSuccessEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class Cart_TransactionListener {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderInternalService orderInternalService;

    @ApplicationModuleListener
    public void clearCartOnPaymentSuccess(TransactionSuccessEvent event) {

        try {
            Integer userId = orderInternalService.getUserIdByOrderId(event.orderId());

            cartRepository.findByUserId(userId).ifPresentOrElse(cart -> {

                cartItemRepository.deleteCheckedItemsByCartId(cart.getId());

            }, () -> {
                log.warn("Không tìm thấy giỏ hàng của User ID: {}", userId);
            });

        } catch (Exception e) {
            log.error("Lỗi khi dọn dẹp giỏ hàng cho Order ID: {}", event.orderId(), e);
        }
    }
}
