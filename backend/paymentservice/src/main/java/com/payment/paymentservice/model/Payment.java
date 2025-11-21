package com.payment.paymentservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    private String paymentIntentId;
    private Double amount;
    private String currency;
    private String status;
    private String sellerAccount;
    private Double adminFee;
    private Date created;
    private String sellerId;
}