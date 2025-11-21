package com.Cartservice.Cartservice.DTO;



import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long productId;
    private String productName;
    private String sellerId;
    private String sellerName;
    private int quantity;
    private double price;
    private double total; // price * quantity
}
