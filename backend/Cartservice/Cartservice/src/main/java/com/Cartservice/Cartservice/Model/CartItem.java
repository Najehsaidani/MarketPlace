package com.Cartservice.Cartservice.Model;




import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem implements Serializable {
    private Long productId;
    private String productName;
    private int quantity;
    private double price;
}