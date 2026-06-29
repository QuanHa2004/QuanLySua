package com.example.backend.modules.payment.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentLinkResponse {
    private String paymentUrl;
}
