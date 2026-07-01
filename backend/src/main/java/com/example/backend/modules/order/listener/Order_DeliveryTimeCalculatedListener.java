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

            LocalDateTime deliveryTime = LocalDateTime.now().plusMinutes(event.estimatedMinutes() + 10);

            order.setDeliveryDate(deliveryTime);
            orderRepository.save(order);
        });
    }
}
