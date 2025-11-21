package com.payment.paymentservice.controller;

import com.payment.paymentservice.dto.ProductRequest;
import com.payment.paymentservice.dto.StripeResponse;
import com.payment.paymentservice.service.StripeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class ProductController {

    private final StripeService stripeService;

    public ProductController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/product/checkout")
    @ResponseBody
    public ResponseEntity<StripeResponse> checkoutProducts(@RequestBody ProductRequest productRequest) {
        System.out.println("Received checkout request for product: " + productRequest.getName());
        System.out.println("Product request details: " + productRequest);
        
        StripeResponse stripeResponse = stripeService.checkoutProducts(productRequest);
        System.out.println("Checkout response status: " + stripeResponse.getStatus());
        System.out.println("Checkout response message: " + stripeResponse.getMessage());
        
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(stripeResponse);
    }

    @GetMapping("/cancel")
    public String cancel() {
        return "cancel";
    }
}