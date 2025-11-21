package com.payment.paymentservice.service;

import com.payment.paymentservice.dto.ProductRequest;
import com.payment.paymentservice.dto.StripeResponse;
import com.payment.paymentservice.model.Payment;
import com.payment.paymentservice.model.Seller;
import com.payment.paymentservice.repository.SellerRepository;
import com.payment.paymentservice.repository.PaymentMongoRepository;
import com.stripe.Stripe;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentListParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class StripeService {

    private final SellerRepository repo;
    
    @Autowired
    private PaymentMongoRepository paymentMongoRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${app.url}")
    private String appUrl;

    public StripeService(SellerRepository repo) {
        this.repo = repo;
    }

    public String createAccountLink(String sellerId) throws Exception {
        Stripe.apiKey = stripeApiKey;

        Seller seller = repo.findById(sellerId);
        if (seller == null) {
            throw new RuntimeException("Seller not found");
        }

        if (seller.getStripeAccountId() == null) {
            // Create a new Express account
            AccountCreateParams params = AccountCreateParams.builder()
                    .setType(AccountCreateParams.Type.EXPRESS)
                    .setEmail(seller.getEmail())
                    .build();

            Account account = Account.create(params);
            seller.setStripeAccountId(account.getId());
            // Make sure to save the seller with the new Stripe account ID
            repo.save(seller);
            System.out.println("Saved seller with Stripe account ID: " + seller.getStripeAccountId());
        } else {
            System.out.println("Seller already has Stripe account ID: " + seller.getStripeAccountId());
        }

        AccountLinkCreateParams linkParams = AccountLinkCreateParams.builder()
                .setAccount(seller.getStripeAccountId())
                .setRefreshUrl(appUrl + "/retry/" + sellerId)
                .setReturnUrl(appUrl + "/success/" + sellerId)
                .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                .build();

        AccountLink link = AccountLink.create(linkParams);
        return link.getUrl();
    }

    public PaymentIntent createPaymentIntent(String sellerId, long amountInCents) throws Exception {
        Stripe.apiKey = stripeApiKey;

        Seller seller = repo.findById(sellerId);
        if (seller == null || seller.getStripeAccountId() == null) {
            throw new RuntimeException("Seller not connected to Stripe!");
        }

        // Calculate admin fee
        double feePercent = 10.0; // or load from application.properties
        long feeAmount = (long) (amountInCents * feePercent / 100);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setDescription("Order from client to seller " + seller.getName())
                .setTransferData(
                        PaymentIntentCreateParams.TransferData.builder()
                                .setDestination(seller.getStripeAccountId()) // Send money to seller
                                .build()
                )
                .setApplicationFeeAmount(feeAmount) // Admin keeps this fee
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        
        // Save payment information to MongoDB
        Payment payment = new Payment();
        payment.setPaymentIntentId(paymentIntent.getId());
        payment.setAmount((double) paymentIntent.getAmount() / 100);
        payment.setCurrency(paymentIntent.getCurrency());
        payment.setStatus(paymentIntent.getStatus());
        payment.setSellerAccount(seller.getStripeAccountId());
        payment.setAdminFee((double) feeAmount / 100);
        payment.setCreated(new java.util.Date(paymentIntent.getCreated() * 1000));
        payment.setSellerId(sellerId);
        paymentMongoRepository.save(payment);
        
        return paymentIntent;
    }

    public List<Map<String, Object>> getAllPayments() throws Exception {
        Stripe.apiKey = stripeApiKey;

        PaymentIntentListParams params = PaymentIntentListParams.builder()
                .setLimit(20L) // last 20 payments
                .build();

        com.stripe.model.PaymentIntentCollection paymentIntents = PaymentIntent.list(params);

        List<Map<String, Object>> list = new ArrayList<>();

        for (PaymentIntent pi : paymentIntents.getData()) {
            Map<String, Object> data = Map.of(
                    "id", pi.getId(),
                    "amount", pi.getAmount() / 100.0,
                    "currency", pi.getCurrency(),
                    "status", pi.getStatus(),
                    "sellerAccount", 
                        pi.getTransferData() != null ? pi.getTransferData().getDestination() : "N/A",
                    "adminFee", 
                        pi.getApplicationFeeAmount() != null ? pi.getApplicationFeeAmount() / 100.0 : 0.0,
                    "created", new java.util.Date(pi.getCreated() * 1000)
            );
            list.add(data);
        }

        return list;
    }

    public StripeResponse checkoutProducts(ProductRequest productRequest) {
        // Set your secret key. Remember to switch to your live secret key in production!
        Stripe.apiKey = stripeApiKey;

        try {
            // Get seller information
            Seller seller = repo.findById(productRequest.getSellerId());
            if (seller == null) {
                throw new RuntimeException("Seller not found");
            }

            System.out.println("Found seller with ID: " + seller.getId() + " and Stripe account: " + seller.getStripeAccountId());

            if (seller.getStripeAccountId() == null) {
                throw new RuntimeException("Seller not connected to Stripe!");
            }

            // Create a PaymentIntent with the order amount and currency
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(productRequest.getName())
                            .build();

            // Create new line item with the above product data and associated price
            SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(productRequest.getCurrency() != null ? productRequest.getCurrency() : "USD")
                            .setUnitAmount(productRequest.getAmount())
                            .setProductData(productData)
                            .build();

            // Calculate total amount based on quantity
            long totalAmount = productRequest.getAmount() * productRequest.getQuantity();

            // Calculate admin fee (10%)
            long adminFee = (long) (totalAmount * 0.1);

            // Create new line item with the above price data
            SessionCreateParams.LineItem lineItem =
                    SessionCreateParams
                            .LineItem.builder()
                            .setQuantity(productRequest.getQuantity())
                            .setPriceData(priceData)
                            .build();

            // Create new session with the line items
            SessionCreateParams params =
                    SessionCreateParams.builder()
                            .setMode(SessionCreateParams.Mode.PAYMENT)
                            .setSuccessUrl(appUrl + "/success-payment")
                            .setCancelUrl(appUrl + "/cancel")
                            .addLineItem(lineItem)
                            .build();

            // Create new session
            Session session = Session.create(params);

            return StripeResponse
                    .builder()
                    .status("SUCCESS")
                    .message("Payment session created ")
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();
        } catch (Exception e) {
            System.err.println("Error during checkout: " + e.getMessage());
            e.printStackTrace();
            return StripeResponse
                    .builder()
                    .status("ERROR")
                    .message("Error creating payment session: " + e.getMessage())
                    .build();
        }
    }
}