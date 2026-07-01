package com.example.backend.modules.order.listener;

import com.example.backend.modules.order.repo.OrderRepository;
import com.example.backend.modules.shipping.event.DeliveryTimeCalculatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class Order_DeliveryTimeCalculatedListener {
    private final OrderRepository orderRepository;

    @ApplicationModuleListener
    public void onDeliveryTimeCalculated(DeliveryTimeCalculatedEvent event) {
        orderRepository.findById(event.orderId()).ifPresent(order -> {
            // Cộng thời gian hiện tại với số phút giao hàng + 10 phút hao phí đóng gói
            LocalDateTime deliveryTime = LocalDateTime.now().plusMinutes(event.estimatedMinutes() + 10);

            // Cập nhật vào trường delivery_date trong bảng Order
            order.setDeliveryDate(deliveryTime);
            orderRepository.save(order);
        });
    }
}
