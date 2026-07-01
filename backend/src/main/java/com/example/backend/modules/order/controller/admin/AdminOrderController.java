package com.example.backend.modules.order.controller.admin;

import com.example.backend.modules.order.dto.response.AdminOrderResponse;
import com.example.backend.modules.order.dto.resquest.ShipOrderRequest;
import com.example.backend.modules.order.entity.Order;
import com.example.backend.modules.order.enums.OrderStatus;
import com.example.backend.modules.order.event.OrderShippedEvent;
import com.example.backend.modules.order.repo.OrderRepository;
import com.example.backend.modules.order.service.OrderService;
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

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;


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

    @PutMapping("/{orderId}/confirm-cod")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')") // Mở khóa dòng này nếu hệ thống đã có Spring Security
    public ResponseEntity<Map<String, Object>> confirmCodOrder(@PathVariable Integer orderId) {
        log.info("➔ [Admin API] Yêu cầu xác nhận đơn hàng COD cho Order ID: {}", orderId);

        try {
            // Gọi xuống Service xử lý nghiệp vụ
            orderService.confirmCodOrder(orderId);

            // Trả về phản hồi thành công chuẩn JSON
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Xác nhận đơn hàng COD thành công. Đơn hàng đã chuyển sang trạng thái đang xử lý và hệ thống đã tự động trừ kho."
            ));

        } catch (RuntimeException e) {
            log.error("❌ Lỗi khi admin xác nhận đơn hàng ID {}: {}", orderId, e.getMessage());

            // Trả về lỗi nghiệp vụ (Bad Request) kèm thông điệp lỗi từ Service
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/{orderId}/ship")
    public ResponseEntity<Map<String, Object>> shipOrder(@PathVariable Integer orderId) {
        log.info("➔ [Admin API] Yêu cầu giao hàng cho Order ID: {}", orderId);
        try {
            orderService.shipOrder(orderId); // Chỉ truyền đúng ID
            return ResponseEntity.ok(Map.of("success", true, "message", "Đã xuất kho thành công."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}