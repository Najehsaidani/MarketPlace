package com.ReviewService.ReviewService.feign.Client;



import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@FeignClient(name = "USER-SERVICE")
public interface UserClient {
    @GetMapping("/client/{id}")
    UserResponse getUserById(@PathVariable String id);
}


