package com.example.backend.modules.payment.controller;

import com.example.backend.modules.payment.event.TransactionEvent;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/payment/vnpay")
@RequiredArgsConstructor
public class VnpayController {

    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    @GetMapping("/callback")
    public void handleVNPayCallback(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
        String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");

        // Trích xuất mã đơn hàng bằng Regex an toàn (chỉ lấy số từ chuỗi "Thanh toan don hang 101")
        Integer orderId = Integer.parseInt(vnp_OrderInfo.replaceAll("[^0-9]", ""));

        String redirectUrl = "http://localhost:3000/checkout";

        if ("00".equals(vnp_ResponseCode)) {
            // Phát sự kiện để module Order cập nhật trạng thái đơn hàng, module Cart dọn giỏ hàng
            eventPublisher.publishEvent(new TransactionEvent(orderId, vnp_TransactionNo));

            redirectUrl += "/success?status=success&order_id=" + orderId;
        } else {
            redirectUrl += "/failed?status=cancel&order_id=" + orderId;
        }

        // Đẩy người dùng quay lại giao diện React (Cổng 3000)
        response.sendRedirect(redirectUrl);
    }
}
