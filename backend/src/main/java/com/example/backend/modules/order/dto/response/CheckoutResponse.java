package com.example.backend.modules.order.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CheckoutResponse {
    @JsonProperty("order_id")
    private Integer orderId;

    @JsonProperty("payment_url")
    private String paymentUrl;
}
