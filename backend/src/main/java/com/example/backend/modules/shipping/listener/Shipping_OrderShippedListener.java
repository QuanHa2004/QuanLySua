package com.example.backend.modules.shipping.listener;

import com.example.backend.modules.order.event.OrderShippedEvent;
import com.example.backend.modules.shipping.event.DeliveryTimeCalculatedEvent;
import com.example.backend.modules.shipping.service.EstimationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Shipping_OrderShippedListener{
    private final EstimationService estimationService;
    private final ApplicationEventPublisher eventPublisher;

    @ApplicationModuleListener
    public void onOrderShipped(OrderShippedEvent event) {
        var estimate = estimationService.calculateEstimate(event.customerLng(), event.customerLat());

        int minutes = estimate.getDurationMinutes().intValue();

        eventPublisher.publishEvent(new DeliveryTimeCalculatedEvent(event.orderId(), minutes));
    }
}
