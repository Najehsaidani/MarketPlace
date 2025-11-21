package com.Cartservice.Cartservice.Repository;



import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Cartservice.Cartservice.Model.Cart;



import java.util.Optional;
@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserId(String userId);
}
