package com.Cartservice.Cartservice.DTO;


import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorGroupResponse {
    private String vendorId;
    private String vendorName;
    private List<CartItemResponse> items;
    private double vendorTotal; 
}
