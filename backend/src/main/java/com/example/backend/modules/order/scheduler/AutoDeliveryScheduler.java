package com.example.backend.modules.order.scheduler;

import com.example.backend.modules.order.entity.Order;
import com.example.backend.modules.order.enums.OrderStatus;
import com.example.backend.modules.order.event.OrderDeliveredEvent;
import com.example.backend.modules.order.repo.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class AutoDeliveryScheduler {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    // Chạy ngầm mỗi 1 phút một lần
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void autoCompleteDeliveredOrders() {

        List<Order> overdueOrders = orderRepository.findShippedOrdersPastDeliveryDate(
                OrderStatus.SHIPPING,
                LocalDateTime.now()
        );

        if (overdueOrders.isEmpty()) {
            return;
        }

        // 2. Duyệt qua từng đơn để chuyển đổi trạng thái và phát sự kiện
        for (Order order : overdueOrders) {
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order); // Cập nhật xuống DB

            // Phát sự kiện giao hàng thành công
            eventPublisher.publishEvent(new OrderDeliveredEvent(order.getId(), order.getUserId()));
        }

    }
}
