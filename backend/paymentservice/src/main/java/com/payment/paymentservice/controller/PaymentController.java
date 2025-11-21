package com.payment.paymentservice.controller;

import com.payment.paymentservice.model.Seller;
import com.payment.paymentservice.repository.SellerRepository;
import com.payment.paymentservice.service.StripeService;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PaymentController {

    private final StripeService stripeService;
    private final SellerRepository repo;

    @Value("${stripe.public.key}")
    private String publicKey;

    public PaymentController(StripeService stripeService, SellerRepository repo) {
        this.stripeService = stripeService;
        this.repo = repo;
    }

    @GetMapping("/checkout/{sellerId}")
    public String checkout(@PathVariable String sellerId, Model model) {
        Seller seller = repo.findById(sellerId);
        if (seller == null) {
            // Create seller if not found
            seller = new Seller();
            seller.setId(sellerId);
            seller.setName("Seller " + sellerId);
            seller.setEmail("seller" + sellerId + "@email.com");
            repo.save(seller);
        }
        
        model.addAttribute("seller", seller);
        model.addAttribute("publicKey", publicKey);
        return "checkout";
    }

    @PostMapping("/create-payment-intent/{sellerId}")
    @ResponseBody
    public String createPaymentIntent(@PathVariable String sellerId, @RequestParam long amount) throws Exception {
        System.out.println("Creating payment intent for seller: " + sellerId + " with amount: " + amount);
        PaymentIntent intent = stripeService.createPaymentIntent(sellerId, amount);
        System.out.println("Payment intent created with client secret: " + intent.getClientSecret());
        return intent.getClientSecret();
    }

    @GetMapping("/success-payment")
    public String paymentSuccess() {
        return "payment-success";
    }
}