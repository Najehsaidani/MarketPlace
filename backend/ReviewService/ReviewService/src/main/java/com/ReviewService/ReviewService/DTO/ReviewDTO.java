package com.ReviewService.ReviewService.DTO;


import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ReviewDTO {
    private String id;
    private String userId;
    private String userName;       // fetched via User microservice
    private String userImageUrl;   // fetched via User microservice
    private String productId;
    private String productName;    // fetched via Product microservice
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt = LocalDateTime.now();

    public ReviewDTO(String userId, String productId, Integer rating, String comment) {
        this.userId = userId;
        this.productId = productId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = LocalDateTime.now();
    }
}
