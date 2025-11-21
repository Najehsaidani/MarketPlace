package com.payment.paymentservice.controller;

import com.payment.paymentservice.service.StripeService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminController {

    private final StripeService stripeService;

    public AdminController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @GetMapping("/admin")
    public String dashboard(Model model) throws Exception {
        model.addAttribute("payments", stripeService.getAllPayments());
        return "admin-dashboard";
    }
}