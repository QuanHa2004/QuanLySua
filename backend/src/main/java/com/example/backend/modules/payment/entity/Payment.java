package com.example.backend.modules.payment.entity;

import com.example.backend.modules.payment.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer id;

    @Column(name = "order_id", nullable = false)
    private Integer orderId;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(name = "transaction_code", length = 100)
    private String transactionCode;

    @Column(name = "bank_code", length = 50)
    private String bankCode;

    @Column(name = "response_code", length = 10)
    private String responseCode;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PaymentStatus status; // Enum: PENDING, SUCCESS, FAILED

    @Column(name = "payment_time", insertable = false, updatable = false)
    private LocalDateTime paymentTime;

    @Column(columnDefinition = "TEXT")
    private String note;
}
