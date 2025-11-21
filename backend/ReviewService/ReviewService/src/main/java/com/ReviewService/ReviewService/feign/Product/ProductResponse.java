package com.ReviewService.ReviewService.feign.Product;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private java.math.BigDecimal price;
    private int stockQuantity;
    private String imageUrl;
    // getters/setters
}
