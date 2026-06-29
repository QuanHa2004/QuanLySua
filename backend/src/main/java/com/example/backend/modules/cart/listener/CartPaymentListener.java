package com.example.backend.modules.cart.listener;

import com.example.backend.modules.cart.repo.CartItemRepository;
import com.example.backend.modules.cart.repo.CartRepository;
import com.example.backend.modules.order.api.OrderInternalService;
import com.example.backend.modules.payment.event.PaymentSuccessEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CartPaymentListener {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderInternalService orderInternalService;

    @ApplicationModuleListener
    public void clearCartOnPaymentSuccess(PaymentSuccessEvent event) {
        log.info("Module Cart nhận sự kiện thanh toán thành công cho Order ID: {}", event.orderId());

        try {
            // 1. Gọi sang module Order để hỏi xem Order này của User nào
            Integer userId = orderInternalService.getUserIdByOrderId(event.orderId());

            if (userId == null) {
                log.warn("Không tìm thấy User ID cho Order ID: {}", event.orderId());
                return;
            }

            // 2. Tìm giỏ hàng của User đó
            cartRepository.findByUserId(userId).ifPresentOrElse(cart -> {

                // 3. Thực thi câu lệnh SQL xóa các sản phẩm đã được chọn mua
                cartItemRepository.deleteCheckedItemsByCartId(cart.getId());

                log.info("Đã xóa thành công các sản phẩm đã thanh toán khỏi giỏ hàng ID: {} của User ID: {}", cart.getId(), userId);

            }, () -> {
                log.warn("Không tìm thấy giỏ hàng của User ID: {}", userId);
            });

        } catch (Exception e) {
            log.error("Lỗi khi dọn dẹp giỏ hàng cho Order ID: {}", event.orderId(), e);
        }
    }
}
