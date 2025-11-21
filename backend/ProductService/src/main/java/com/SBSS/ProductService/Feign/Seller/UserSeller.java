package com.SBSS.ProductService.Feign.Seller;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@FeignClient(name = "USER-SERVICE")
public interface UserSeller {
    @GetMapping("/seller/{id}")
    UserResponse getUserById(@PathVariable String id);
}
