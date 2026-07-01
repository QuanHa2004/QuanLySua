package com.example.backend.modules.order.service.admin;

import com.example.backend.modules.order.dto.response.AdminOrderResponse;
import com.example.backend.modules.order.entity.Order;
import com.example.backend.modules.order.enums.OrderStatus;
import com.example.backend.modules.order.event.OrderProcessingEvent;
import com.example.backend.modules.order.event.OrderShippedEvent;
import com.example.backend.modules.order.repo.OrderRepository;
import com.example.backend.modules.payment.enums.PaymentMethod;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    public List<AdminOrderResponse> getAllOrdersForAdmin() {

        List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();

        return orders.stream().map(order -> {

            String statusString = order.getStatus() != null
                    ? order.getStatus().name().toLowerCase()
                    : "pending";

            return AdminOrderResponse.builder()
                    .orderId(order.getId())
                    .fullName(order.getFullName())
                    .phone(order.getPhone())
                    .orderDate(order.getOrderDate())
                    .totalAmount(order.getTotalAmount())
                    .status(statusString)
                    .build();
        }).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public void confirmCodOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể xác nhận đơn hàng đang ở trạng thái Chờ xác nhận!");
        }

        if (order.getPaymentMethod() != PaymentMethod.COD) {
            throw new RuntimeException("Hàm này chỉ dành cho việc xác nhận đơn COD!");
        }

        order.setStatus(OrderStatus.PROCESSING);
        orderRepository.save(order);

        eventPublisher.publishEvent(new OrderProcessingEvent(order.getId(), order.getUserId()));
    }

    @Transactional(rollbackFor = Exception.class)
    public void shipOrder(Integer orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng mã #" + orderId));

        if (order.getStatus() != OrderStatus.PROCESSING) {
            throw new RuntimeException("Lỗi: Chỉ có thể giao đơn hàng đang ở trạng thái 'Đang xử lý'!");
        }

        order.setStatus(OrderStatus.SHIPPING);
        orderRepository.save(order);

        String lng = order.getCustomerLng() != null ? order.getCustomerLng() : "106.6297";
        String lat = order.getCustomerLat() != null ? order.getCustomerLat() : "10.8231";

        eventPublisher.publishEvent(new OrderShippedEvent(order.getId(), lng, lat));
    }
}
