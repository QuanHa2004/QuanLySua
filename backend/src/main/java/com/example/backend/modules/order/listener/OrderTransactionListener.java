package com.example.backend.modules.order.listener;

import com.example.backend.modules.order.enums.OrderStatus;
import com.example.backend.modules.order.repo.OrderRepository;
import com.example.backend.modules.payment.event.TransactionEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderTransactionListener {
    private final OrderRepository orderRepository;

    @ApplicationModuleListener // Chạy ngầm bảo mật, an toàn transaction
    public void onPaymentSuccess(TransactionEvent event) {
        orderRepository.findById(event.orderId()).ifPresent(order -> {
            order.setStatus(OrderStatus.PROCESSING);
            orderRepository.save(order);
        });
    }
}
