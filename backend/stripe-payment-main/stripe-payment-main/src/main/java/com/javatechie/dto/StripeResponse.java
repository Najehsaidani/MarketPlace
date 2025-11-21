package com.javatechie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StripeResponse {

    public StripeResponse(String id, String paymentStatus) {
        //TODO Auto-generated constructor stub
    }
    private String status;
    private String message;
    private String sessionId;
    private String sessionUrl;
}
