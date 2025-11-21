package com.payment.paymentservice.repository;

import com.payment.paymentservice.model.Seller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class SellerRepository {
    
    @Autowired
    private SellerMongoRepository sellerMongoRepository;

    public Seller findById(String id) {
        return sellerMongoRepository.findById(id).orElse(null);
    }

    public void save(Seller seller) {
        sellerMongoRepository.save(seller);
    }
}