package com.example.backend.modules.order.controller.admin;

import com.example.backend.modules.order.dto.response.AdminOrderResponse;
import com.example.backend.modules.order.repo.OrderRepository;
import com.example.backend.modules.order.service.admin.AdminOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
@Slf4j
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            List<AdminOrderResponse> orderList = adminOrderService.getAllOrdersForAdmin();
            return ResponseEntity.ok(Map.of("data", orderList));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Không thể tải danh sách đơn hàng"));
        }
    }

    @PutMapping("/{orderId}/confirm-cod")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> confirmCodOrder(@PathVariable Integer orderId) {

        try {
            adminOrderService.confirmCodOrder(orderId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Xác nhận đơn hàng COD thành công. Đơn hàng đã chuyển sang trạng thái đang xử lý và hệ thống đã tự động trừ kho."
            ));

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/{orderId}/ship")
    public ResponseEntity<Map<String, Object>> shipOrder(@PathVariable Integer orderId) {

        try {
            adminOrderService.shipOrder(orderId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Đã xuất kho thành công."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}