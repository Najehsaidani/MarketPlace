package com.ReviewService.ReviewService.Model;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    private String id;

    private String userId;     // reference to user in User Service
    private String productId;  // reference to product in Product Service
    private int rating;
    private String comment;
    private LocalDateTime createdAt = LocalDateTime.now();
}
