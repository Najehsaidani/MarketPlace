package com.Cartservice.Cartservice.feign.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;

@FeignClient(name = "USER-SERVICE")
public interface UserClient {
    @GetMapping("client/{id}")
    UserResponse getClientById(@PathVariable String id);
    @GetMapping("seller/{id}")
    UserResponse getSellerById(@PathVariable String id);
}
