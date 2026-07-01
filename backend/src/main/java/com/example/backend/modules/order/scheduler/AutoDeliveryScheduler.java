package com.example.backend.modules.order.scheduler;

import com.example.backend.modules.order.enums.OrderStatus;
import com.example.backend.modules.order.repo.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class AutoDeliveryScheduler {

    private final OrderRepository orderRepository;

    // Chạy ngầm mỗi 1 phút một lần
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void autoCompleteDeliveredOrders() {

        int updatedCount = orderRepository.autoUpdateDeliveredStatus(
                OrderStatus.DELIVERED,
                OrderStatus.SHIPPING
        );

        if (updatedCount > 0) {
            log.info("➔ [Cron Job] Đã tự động cập nhật {} đơn hàng thành DELIVERED", updatedCount);
        }
    }
}
