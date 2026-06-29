package com.example.backend.modules.order.dto.resquest;

import com.example.backend.modules.payment.enums.PaymentMethod;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CheckoutRequest {
    @JsonProperty("payment_method")
    private PaymentMethod paymentMethod;

    @JsonProperty("full_name")
    private String fullName;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("delivery_address")
    private String deliveryAddress;
}
