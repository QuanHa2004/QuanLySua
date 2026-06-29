package com.example.backend.modules.order.controller.customer;

import com.example.backend.modules.order.dto.response.CheckoutResponse;
import com.example.backend.modules.order.dto.resquest.CheckoutRequest;
import com.example.backend.modules.order.service.OrderService;
import com.example.backend.modules.user.api.UserInternalService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/customer/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserInternalService userInternalService;

    @PostMapping("/checkout")
    public ResponseEntity<?> processCheckout(
            @RequestBody CheckoutRequest request,
            HttpServletRequest httpRequest) {
        try {
            // 1. Lấy định danh người dùng đang đăng nhập
            Integer userId = getCurrentUserId();

            // 2. Lấy IP của thiết bị client
            String ipAddress = getClientIp(httpRequest);

            // 3. Thực thi nghiệp vụ chốt đơn
            CheckoutResponse response = orderService.checkout(userId, request, ipAddress);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Hàm tiện ích: Lấy User ID từ Context Security
    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 1. Lấy email từ token (Ví dụ: "hahongquan2004@gmail.com")
        String email = authentication.getName();

        // 2. Gọi sang module User để lấy ID thực sự
        return userInternalService.getUserIdByEmail(email);
    }

    // Hàm tiện ích: Lấy IP chuẩn của thiết bị xuyên qua các tầng Proxy/Load Balancer
    private String getClientIp(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }

        if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
            ipAddress = "127.0.0.1";
        }

        // Trường hợp qua nhiều proxy, IP đầu tiên là IP gốc của client
        if (ipAddress != null && ipAddress.length() > 15 && ipAddress.indexOf(",") > 0) {
            ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
        }
        return ipAddress;
    }
}