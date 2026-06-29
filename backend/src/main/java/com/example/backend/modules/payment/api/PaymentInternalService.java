package com.example.backend.modules.payment.api;

import com.example.backend.modules.payment.dto.response.PaymentLinkResponse;

import java.math.BigDecimal;

public interface PaymentInternalService {
    PaymentLinkResponse createVNPayUrl(Integer orderId, BigDecimal amount, String ipAddress);
}