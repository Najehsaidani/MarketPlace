package com.Cartservice.Cartservice.Model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "carts")
public class Cart {
    @Id
    private String id;
    private String userId;
    private List<VendorGroup> vendorGroups = new ArrayList<>();
    private double totalPrice; // total across all vendors
    
    public Cart(String userId, List<VendorGroup> vendorGroups) {
        this.userId = userId;
        this.vendorGroups = vendorGroups;
    }
}