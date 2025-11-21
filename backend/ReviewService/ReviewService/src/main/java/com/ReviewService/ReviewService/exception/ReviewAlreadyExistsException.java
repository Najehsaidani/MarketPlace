package com.ReviewService.ReviewService.exception;

public class ReviewAlreadyExistsException extends RuntimeException {
    public ReviewAlreadyExistsException(String message) {
        super(message);
    }
}