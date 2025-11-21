package com.chatservice.chatservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {
    @GetMapping("/client/{id}")
    UserResponse getClientById(@PathVariable Integer id);
    
    @GetMapping("/seller/{id}")
    UserResponse getSellerById(@PathVariable Integer id);
    @GetMapping("/seller")
    List<UserResponse> getAllSellers();
    
    @GetMapping("/admin/get_clients")
    List<UserResponse> getAllClients();
}