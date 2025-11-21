package com.payment.paymentservice.feign.product;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String sellerId;
    private String vendorName;
    private double price;
    private int stockQuantity;
}