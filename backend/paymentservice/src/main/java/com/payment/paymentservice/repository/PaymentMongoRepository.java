package com.payment.paymentservice.repository;

import com.payment.paymentservice.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMongoRepository extends MongoRepository<Payment, String> {
    List<Payment> findBySellerId(String sellerId);
    List<Payment> findTop20ByOrderByCreatedDesc();
}