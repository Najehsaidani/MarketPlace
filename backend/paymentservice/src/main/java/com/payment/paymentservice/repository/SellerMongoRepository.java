package com.payment.paymentservice.repository;

import com.payment.paymentservice.model.Seller;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SellerMongoRepository extends MongoRepository<Seller, String> {
}