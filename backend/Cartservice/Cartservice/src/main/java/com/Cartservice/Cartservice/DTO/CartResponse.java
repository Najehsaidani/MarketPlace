package com.Cartservice.Cartservice.DTO;



import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private String userId;
    private List<VendorGroupResponse> vendorGroups;
    private double totalPrice; // grand total
}
