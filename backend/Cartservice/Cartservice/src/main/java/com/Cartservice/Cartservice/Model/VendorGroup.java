package com.Cartservice.Cartservice.Model;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorGroup {
    private String vendorId;
    private String vendorName;
    private List<CartItem> items = new ArrayList<>();
    
    public VendorGroup(String vendorId, String vendorName, ArrayList<CartItem> items) {
        this.vendorId = vendorId;
        this.vendorName = vendorName;
        this.items = items;
    }
}