package com.example.backend.modules.order.listener;

import com.example.backend.modules.order.enums.OrderStatus;
import com.example.backend.modules.order.event.OrderProcessingEvent;
import com.example.backend.modules.order.repo.OrderRepository;
import com.example.backend.modules.payment.event.TransactionFailedEvent;
import com.example.backend.modules.payment.event.TransactionSuccessEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Order_TransactionListener {
    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    @ApplicationModuleListener
    public void onPaymentSuccess(TransactionSuccessEvent event) {
        orderRepository.findById(event.orderId()).ifPresent(order -> {
            order.setStatus(OrderStatus.PROCESSING);
            orderRepository.save(order);

            eventPublisher.publishEvent(new OrderProcessingEvent(order.getId(), order.getUserId()));
        });
    }

    @ApplicationModuleListener
    public void onPaymentFailed(TransactionFailedEvent event) {
        orderRepository.findById(event.orderId()).ifPresent(order -> {
            order.setStatus(OrderStatus.CANCELLED);
            order.setNote("Tự động hủy do giao dịch VNPay thất bại hoặc bị khách hàng đóng.");
            orderRepository.save(order);
        });
    }
}
