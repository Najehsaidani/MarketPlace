package com.ReviewService.ReviewService.feign.Client;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String nom;
    private String ImageUrl;
   
}