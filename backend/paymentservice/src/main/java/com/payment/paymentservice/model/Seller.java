package com.payment.paymentservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "sellers")
public class Seller {
    @Id
    private String id;
    private String name;
    private String email;
    private String stripeAccountId;
}