package com.ReviewService.ReviewService.Service.Interface;




import java.util.List;
import java.util.Optional;

import com.ReviewService.ReviewService.DTO.ReviewDTO;

public interface ReviewService {
    ReviewDTO saveReview(ReviewDTO reviewDTO);
    ReviewDTO updateReview(String id, ReviewDTO reviewDTO);
    Optional<ReviewDTO> getReviewById(String id);
    List<ReviewDTO> getAllReviews();
    List<ReviewDTO> getReviewsByProductId(String productId);
    List<ReviewDTO> getReviewsByUserId(String userId);
    void deleteReview(String id);
    boolean hasUserReviewedProduct(String userId, String productId);
}
