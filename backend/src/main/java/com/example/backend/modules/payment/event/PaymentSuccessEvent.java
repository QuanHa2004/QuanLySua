package com.example.backend.modules.payment.event;

public record PaymentSuccessEvent (Integer orderId, String transactionNo) {
}
