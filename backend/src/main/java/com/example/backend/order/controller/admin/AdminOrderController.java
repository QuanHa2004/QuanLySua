package com.example.backend.order.controller.admin;

import com.example.backend.order.dto.response.AdminOrderResponse;
import com.example.backend.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            List<AdminOrderResponse> orderList = orderService.getAllOrdersForAdmin();
            // Trả về JSON format: { "data": [...] } khớp hoàn toàn với code React
            return ResponseEntity.ok(Map.of("data", orderList));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Không thể tải danh sách đơn hàng"));
        }
    }
}