package com.Cartservice.Cartservice.Service.Interface;

import com.Cartservice.Cartservice.DTO.AddToCartRequest;
import com.Cartservice.Cartservice.DTO.CartResponse;

public interface CartService {

    CartResponse addToCart(AddToCartRequest request);

    CartResponse getCartByUser(String userId);

    CartResponse removeFromCart(String userId, String vendorId, Long productId);

    CartResponse updateQuantity(String userId, String vendorId, Long productId, int quantity);

    void clearCart(String userId);
}

