package com.example.backend.modules.payment.event;

public record TransactionEvent(Integer orderId, String transactionNo) {
}
