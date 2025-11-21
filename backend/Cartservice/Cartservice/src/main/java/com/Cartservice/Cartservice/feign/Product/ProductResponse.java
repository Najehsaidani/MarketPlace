package com.Cartservice.Cartservice.feign.Product;

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