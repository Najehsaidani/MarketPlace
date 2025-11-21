package com.Cartservice.Cartservice.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {
    private String userId;
    private Long productId;
    private int quantity;
}