package com.chatservice.chatservice.feign;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer id;
    private String email;
    private String nom;
    private boolean estVendeur; 
    public boolean isSeller() { return estVendeur; }
    public boolean isClient() { return !estVendeur; }
}