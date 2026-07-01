package com.example.backend.modules.shipping.listener;

import com.example.backend.modules.order.event.OrderShippedEvent;
import com.example.backend.modules.shipping.event.DeliveryTimeCalculatedEvent;
import com.example.backend.modules.shipping.service.EstimationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class Shipping_OrderShippedListener{
    private final EstimationService estimationService;
    private final ApplicationEventPublisher eventPublisher;

    @ApplicationModuleListener
    public void onOrderShipped(OrderShippedEvent event) {
        log.info("➔ [Shipping] Bắt đầu tính toán lộ trình cho đơn hàng #{}", event.orderId());

        // 1. Gọi API OpenRouteService (Hàm tính toán bạn đã viết ở bước trước)
        var estimate = estimationService.calculateEstimate(event.customerLng(), event.customerLat());

        // 2. Chuyển đổi ra phút (Ví dụ API trả về 45.5 phút -> làm tròn 46 phút)
        int minutes = estimate.getDurationMinutes().intValue();

        // 3. Báo cáo lại cho hệ thống biết thời gian giao dự kiến
        eventPublisher.publishEvent(new DeliveryTimeCalculatedEvent(event.orderId(), minutes));
    }
}
