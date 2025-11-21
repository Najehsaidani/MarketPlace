package com.payment.paymentservice.controller;

import com.payment.paymentservice.model.Seller;
import com.payment.paymentservice.repository.SellerRepository;
import com.payment.paymentservice.service.StripeService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class SellerController {

    private final SellerRepository repo;
    private final StripeService stripeService;

    public SellerController(SellerRepository repo, StripeService stripeService) {
        this.repo = repo;
        this.stripeService = stripeService;
    }

    @GetMapping("/")
    public String home(Model model) {
        // Try to find existing seller first
        Seller seller = repo.findById("1");
        if (seller == null) {
            // Create new seller only if not found
            seller = new Seller();
            seller.setId("1");
            seller.setName("Seller One");
            seller.setEmail("seller@email.com");
            repo.save(seller);
        }

        model.addAttribute("seller", seller);
        return "index";
    }

    @GetMapping("/products")
    public String products(Model model) {
        // Try to find existing seller first
        Seller seller = repo.findById("1");
        if (seller == null) {
            // Create new seller only if not found
            seller = new Seller();
            seller.setId("1");
            seller.setName("Seller One");
            seller.setEmail("seller@email.com");
            repo.save(seller);
        }

        model.addAttribute("seller", seller);
        return "products";
    }

    @GetMapping("/connect/{sellerId}")
    public String connect(@PathVariable String sellerId) throws Exception {
        String url = stripeService.createAccountLink(sellerId);
        return "redirect:" + url;
    }

    @GetMapping("/success/{sellerId}")
    public String success(@PathVariable String sellerId, Model model) {
        Seller seller = repo.findById(sellerId);
        model.addAttribute("seller", seller);
        return "success";
    }
}