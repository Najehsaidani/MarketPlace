package com.Cartservice.Cartservice.Controller;



import com.Cartservice.Cartservice.DTO.AddToCartRequest;
import com.Cartservice.Cartservice.DTO.CartResponse;
import com.Cartservice.Cartservice.Service.Interface.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // ✅ 1. Add item to cart
    @PostMapping("/add")
    public ResponseEntity<CartResponse> addToCart(@RequestBody AddToCartRequest request) {
        CartResponse response = cartService.addToCart(request);
        return ResponseEntity.ok(response);
    }

    // ✅ 2. Get user's cart
    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable String userId) {
        CartResponse response = cartService.getCartByUser(userId);
        return ResponseEntity.ok(response);
    }

    // ✅ 3. Remove specific item from cart
    @DeleteMapping("/{userId}/vendor/{vendorId}/product/{productId}")
    public ResponseEntity<CartResponse> removeFromCart(
            @PathVariable String userId,
            @PathVariable String vendorId,
            @PathVariable Long productId) {
        CartResponse response = cartService.removeFromCart(userId, vendorId, productId);
        return ResponseEntity.ok(response);
    }

    // ✅ 4. Update quantity for an item
    @PutMapping("/{userId}/vendor/{vendorId}/product/{productId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @PathVariable String userId,
            @PathVariable String vendorId,
            @PathVariable Long productId,
            @RequestParam int quantity) {
        CartResponse response = cartService.updateQuantity(userId, vendorId, productId, quantity);
        return ResponseEntity.ok(response);
    }

    // ✅ 5. Clear all cart items for a user
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<String> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully for user " + userId);
    }
}
