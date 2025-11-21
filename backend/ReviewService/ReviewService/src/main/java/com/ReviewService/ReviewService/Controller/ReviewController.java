package com.ReviewService.ReviewService.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ReviewService.ReviewService.DTO.ReviewDTO;
import com.ReviewService.ReviewService.Service.Interface.ReviewService;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ✅ Get all reviews
    @GetMapping
    public List<ReviewDTO> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // ✅ Get review by ID
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable String id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Get reviews by product ID
    @GetMapping("/product/{productId}")
    public List<ReviewDTO> getReviewsByProductId(@PathVariable String productId) {
        return reviewService.getReviewsByProductId(productId);
    }

    // ✅ Get reviews by user ID
    @GetMapping("/user/{userId}")
    public List<ReviewDTO> getReviewsByUserId(@PathVariable String userId) {
        return reviewService.getReviewsByUserId(userId);
    }

    // ✅ Create a review
    @PostMapping
    public ReviewDTO createReview(@RequestBody ReviewDTO reviewDTO) {
        return reviewService.saveReview(reviewDTO);
    }

    // ✅ Update review
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable String id, @RequestBody ReviewDTO reviewDTO) {
        try {
            ReviewDTO updatedReview = reviewService.updateReview(id, reviewDTO);
            return ResponseEntity.ok(updatedReview);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Delete review
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
