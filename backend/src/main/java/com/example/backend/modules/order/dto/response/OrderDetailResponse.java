package com.example.backend.modules.order.dto.response;

import com.example.backend.modules.order.api.OrderItemSnapshot;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OrderDetailResponse {
    @JsonProperty("order_id")
    private Integer orderId;

    @JsonProperty("order_date")
    private String orderDate;

    private String status;

    @JsonProperty("payment_method")
    private String paymentMethod;

    @JsonProperty("full_name")
    private String fullName;

    private String phone;

    @JsonProperty("delivery_address")
    private String deliveryAddress;

    @JsonProperty("total_amount")
    private BigDecimal totalAmount;

    private List<OrderItemSnapshot> items;
}
