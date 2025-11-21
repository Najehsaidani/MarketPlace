package com.Cartservice.Cartservice.feign.Client;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String email;
    private String nom;
}
