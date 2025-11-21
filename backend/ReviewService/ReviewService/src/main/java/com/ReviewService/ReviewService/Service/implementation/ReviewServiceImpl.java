package com.ReviewService.ReviewService.Service.implementation;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ReviewService.ReviewService.DTO.ReviewDTO;
import com.ReviewService.ReviewService.Model.Review;
import com.ReviewService.ReviewService.Repository.ReviewRepository;
import com.ReviewService.ReviewService.Service.Interface.ReviewService;
import com.ReviewService.ReviewService.feign.Client.UserClient;
import com.ReviewService.ReviewService.feign.Client.UserResponse;
import com.ReviewService.ReviewService.feign.Product.ProductClient;
import com.ReviewService.ReviewService.feign.Product.ProductResponse;
import com.ReviewService.ReviewService.exception.ReviewAlreadyExistsException;

import java.util.NoSuchElementException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserClient userClient;
    private final ProductClient productClient;

    @Override
    public ReviewDTO saveReview(ReviewDTO dto) {
        // ✅ Validate User exists
        UserResponse userResponse;
        try {
            userResponse = userClient.getUserById(dto.getUserId());
        } catch (Exception e) {
            throw new RuntimeException("User not found with ID: " + dto.getUserId());
        }

        // ✅ Validate Product exists
        ProductResponse productResponse;
        try {
            Long productId = Long.parseLong(dto.getProductId());
            productResponse = productClient.getProductById(productId);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid product ID format: " + dto.getProductId());
        } catch (Exception e) {
            throw new RuntimeException("Product not found with ID: " + dto.getProductId());
        }

        // ✅ Check duplicate review
        if (reviewRepository.findByUserIdAndProductId(dto.getUserId(), dto.getProductId()).isPresent()) {
            throw new ReviewAlreadyExistsException("You already reviewed this product.");
        }

        // Set user and product names
        dto.setUserName(userResponse.getNom() );
        dto.setProductName(productResponse.getName());

        // ✅ Save review
        Review review = convertToEntity(dto);

        return convertToDTO(reviewRepository.save(review));
    }

    @Override
    public Optional<ReviewDTO> getReviewById(String id) {
        return reviewRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByProductId(String productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByUserId(String userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDTO updateReview(String id, ReviewDTO reviewDTO) {
        // Check if review exists
        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Review not found with ID: " + id));
        
        // Update fields
        existingReview.setRating(reviewDTO.getRating());
        existingReview.setComment(reviewDTO.getComment());
        existingReview.setCreatedAt(reviewDTO.getCreatedAt());
        
        // Save updated review
        return convertToDTO(reviewRepository.save(existingReview));
    }

    @Override
    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }

    @Override
    public boolean hasUserReviewedProduct(String userId, String productId) {
        return reviewRepository.findByUserIdAndProductId(userId, productId).isPresent();
    }

    private Review convertToEntity(ReviewDTO dto) {
        Review review = new Review();
        review.setId(dto.getId());
        review.setUserId(dto.getUserId());
        review.setProductId(dto.getProductId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(dto.getCreatedAt());
        return review;
    }

    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setUserId(review.getUserId());
        dto.setProductId(review.getProductId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        
        // Fetch user information
        try {
            UserResponse userResponse = userClient.getUserById(review.getUserId());
            dto.setUserName(userResponse.getNom());
            dto.setUserImageUrl(userResponse.getImageUrl());
        } catch (Exception e) {
            // If user service is unavailable, leave user fields as null
            dto.setUserName("Unknown User");
        }
        
        // Fetch product information
        try {
            Long productId = Long.parseLong(review.getProductId());
            ProductResponse productResponse = productClient.getProductById(productId);
            dto.setProductName(productResponse.getName());
        } catch (Exception e) {
            // If product service is unavailable or ID is invalid, leave product name as null
            dto.setProductName("Unknown Product");
        }
        
        return dto;
    }
}
