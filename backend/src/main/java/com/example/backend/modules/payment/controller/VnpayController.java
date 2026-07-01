package com.example.backend.modules.payment.controller;

import com.example.backend.modules.payment.entity.Payment;
import com.example.backend.modules.payment.enums.PaymentStatus;
import com.example.backend.modules.payment.event.TransactionFailedEvent;
import com.example.backend.modules.payment.event.TransactionSuccessEvent;
import com.example.backend.modules.payment.repo.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/payment/vnpay")
@RequiredArgsConstructor
public class VnpayController {

    private final ApplicationEventPublisher eventPublisher;
    private final PaymentRepository paymentRepository;

    @Transactional
    @GetMapping("/callback")
    public void handleVNPayCallback(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_OrderInfo = request.getParameter("vnp_OrderInfo");
        String vnp_TransactionNo = request.getParameter("vnp_TransactionNo");
        String vnp_BankCode = request.getParameter("vnp_BankCode");
        String vnp_Amount = request.getParameter("vnp_Amount");

        Integer orderId = Integer.parseInt(vnp_OrderInfo.replaceAll("[^0-9]", ""));

        BigDecimal actualAmount = new BigDecimal(vnp_Amount).divide(new BigDecimal(100));

        boolean isSuccess = "00".equals(vnp_ResponseCode);
        PaymentStatus currentStatus = isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

        Payment payment = Payment.builder()
                .orderId(orderId)
                .paymentMethod("VNPAY")
                .transactionCode(vnp_TransactionNo)
                .bankCode(vnp_BankCode)
                .responseCode(vnp_ResponseCode)
                .amount(actualAmount)
                .status(currentStatus)
                .note(vnp_OrderInfo)
                .build();

        paymentRepository.save(payment);

        String redirectUrl = "http://localhost:3000/checkout";

        if (isSuccess) {
            eventPublisher.publishEvent(new TransactionSuccessEvent(orderId, vnp_TransactionNo));
            redirectUrl += "/success?status=success&order_id=" + orderId;
        } else {
            eventPublisher.publishEvent(new TransactionFailedEvent(orderId));
            redirectUrl += "/failed?status=cancel&order_id=" + orderId;
        }

        response.sendRedirect(redirectUrl);
    }
}
