package com.example.backend.modules.order.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminOrderResponse {
    @JsonProperty("order_id")
    private Integer orderId;

    // Dữ liệu khách hàng (Trong thực tế có thể lấy từ bảng User hoặc thông tin giao hàng của đơn)
    @JsonProperty("full_name")
    private String fullName;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("order_date")
    private LocalDateTime orderDate;

    @JsonProperty("total_amount")
    private BigDecimal totalAmount;

    @JsonProperty("status")
    private String status;
}
