package com.example.backend.modules.order.entity;

import com.example.backend.modules.order.enums.OrderStatus;
import com.example.backend.modules.order.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders") // "order" là từ khóa của SQL, table của bạn đặt là orders là rất chuẩn
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer id;

    // LƯU Ý: Ranh giới Module. Chỉ lưu ID, KHÔNG lưu Object User
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status; // Enum: PENDING, PROCESSING, SHIPPING, DELIVERED, CANCELLED

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    @Column(name = "order_date", insertable = false, updatable = false)
    private LocalDateTime orderDate;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Column(name = "shipping_fee", precision = 12, scale = 2)
    private BigDecimal shippingFee;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "is_paid")
    private Boolean isPaid = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod; // Enum: COD, MOMO, VNPAY, BANK_TRANSFER

    @Column(columnDefinition = "TEXT")
    private String note;
}
