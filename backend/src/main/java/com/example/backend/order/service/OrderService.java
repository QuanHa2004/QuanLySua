package com.example.backend.order.service;

import com.example.backend.order.dto.response.AdminOrderResponse;
import com.example.backend.order.entity.Order;
import com.example.backend.order.repo.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;

    public List<AdminOrderResponse> getAllOrdersForAdmin() {
        // Lấy danh sách đơn hàng, sắp xếp mới nhất lên đầu
        List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();

        return orders.stream().map(order -> {

            // 1. Chuyển đổi Enum thành String chữ thường để Frontend React đọc được màu sắc
            // Ví dụ: PROCESSING -> "processing"
            String statusString = order.getStatus() != null
                    ? order.getStatus().name().toLowerCase()
                    : "pending";

            // 2. Map dữ liệu trực tiếp vào DTO (Không cần query sang module User)
            return AdminOrderResponse.builder()
                    .orderId(order.getId())
                    .fullName(order.getFullName()) // Lấy trực tiếp từ bảng Order
                    .phone(order.getPhone())       // Lấy trực tiếp từ bảng Order
                    .orderDate(order.getOrderDate())
                    .totalAmount(order.getTotalAmount())
                    .status(statusString)
                    .build();
        }).toList();
    }
}
