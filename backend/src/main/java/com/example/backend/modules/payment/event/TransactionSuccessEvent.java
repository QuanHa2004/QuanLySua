package com.example.backend.modules.payment.event;

public record TransactionSuccessEvent(Integer orderId, String transactionNo) {
}
