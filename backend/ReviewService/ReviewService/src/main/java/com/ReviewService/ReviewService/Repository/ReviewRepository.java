package com.ReviewService.ReviewService.Repository;




import org.springframework.data.mongodb.repository.MongoRepository;

import com.ReviewService.ReviewService.Model.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByProductId(String productId);

    List<Review> findByUserId(String userId);

    Optional<Review> findByUserIdAndProductId(String userId, String productId);
}
