package com.payment.paymentservice.feign.product;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PRODUCT-SERVICE")
public interface ProductClient {
    @GetMapping("api/products/{id}")
    ProductResponse getProductById(@PathVariable Long id);
}