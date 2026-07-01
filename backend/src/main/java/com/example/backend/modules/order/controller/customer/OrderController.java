package com.example.backend.modules.order.controller.customer;

import com.example.backend.modules.order.dto.response.CheckoutResponse;
import com.example.backend.modules.order.dto.response.OrderDetailResponse;
import com.example.backend.modules.order.dto.resquest.CheckoutRequest;
import com.example.backend.modules.order.service.customer.CustomerOrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer/orders")
@RequiredArgsConstructor
public class OrderController {

    private final CustomerOrderService customerOrderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> processCheckout(
            @RequestBody CheckoutRequest request,
            HttpServletRequest httpRequest) {
        try {

            Integer userId = customerOrderService.getCurrentUserId();
            String ipAddress = customerOrderService.getClientIp(httpRequest);
            CheckoutResponse response = customerOrderService.checkout(userId, request, ipAddress);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> getMyOrderHistory() {
        try {

            Integer userId = customerOrderService.getCurrentUserId();
            List<OrderDetailResponse> history = customerOrderService.getOrderHistory(userId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", history
            ));

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Không thể lấy lịch sử mua hàng"
            ));
        }
    }

    @GetMapping("/{orderId}/details")
    public ResponseEntity<Map<String, Object>> getOrderDetail(
            @PathVariable("orderId") Integer orderId
    ) {
        try {

            Integer userId = customerOrderService.getCurrentUserId();
            OrderDetailResponse detailResponse = customerOrderService.getOrderDetail(userId, orderId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", detailResponse
            ));

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}