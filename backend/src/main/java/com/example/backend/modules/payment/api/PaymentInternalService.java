package com.example.backend.modules.payment.api;

import java.math.BigDecimal;

public interface PaymentInternalService {
    PaymentLinkSnapshot createVNPayUrl(Integer orderId, BigDecimal amount, String ipAddress);
}