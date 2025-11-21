package com.Cartservice.Cartservice.Service.Implementation;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.Cartservice.Cartservice.DTO.AddToCartRequest;
import com.Cartservice.Cartservice.DTO.CartItemResponse;
import com.Cartservice.Cartservice.DTO.CartResponse;
import com.Cartservice.Cartservice.DTO.VendorGroupResponse;
import com.Cartservice.Cartservice.Model.Cart;
import com.Cartservice.Cartservice.Model.CartItem;
import com.Cartservice.Cartservice.Model.VendorGroup;
import com.Cartservice.Cartservice.Repository.CartRepository;
import com.Cartservice.Cartservice.Service.Interface.CartService;
import com.Cartservice.Cartservice.feign.Client.UserClient;
import com.Cartservice.Cartservice.feign.Client.UserResponse;
import com.Cartservice.Cartservice.feign.Product.ProductClient;
import com.Cartservice.Cartservice.feign.Product.ProductResponse;


import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductClient productClient;
    private final UserClient userClient;


    @Override
    public CartResponse addToCart(AddToCartRequest request) {
        // ✅ 1. Validate user
        UserResponse seller;
        try {
            UserResponse user = userClient.getClientById(request.getUserId());
        } catch (Exception e) {
            throw new RuntimeException("❌ client not found with ID: " + request.getUserId());
        }
       
        // ✅ 2. Validate product
        ProductResponse product;
        try {
            product = productClient.getProductById(request.getProductId());
        } catch (Exception e) {
            throw new RuntimeException("❌ Product not found with ID: " + request.getProductId());
        }

        // ✅ 3. Check if product has valid vendor information
        if (product.getSellerId() == null) {
            throw new RuntimeException("❌ Product with ID " + request.getProductId() + " has invalid vendor information");
        }
         try {
            seller = userClient.getSellerById(product.getSellerId());
        } catch (Exception e) {
            throw new RuntimeException("❌ Seller not found with ID: " + product.getSellerId());
        }


        // ✅ 4. Check stock
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("⚠️ Not enough stock for product: " + product.getName());
        }

        // ✅ 5. Fetch or create cart
        Cart cart = cartRepository.findByUserId(request.getUserId())
                .orElseGet(() -> new Cart(request.getUserId(), new ArrayList<>()));

        // ✅ 6. Find vendor group
        Optional<VendorGroup> vendorGroupOpt = cart.getVendorGroups().stream()
                .filter(v -> v.getVendorId() != null && v.getVendorId().equals(product.getSellerId()))
                .findFirst();

        VendorGroup vendorGroup = vendorGroupOpt.orElseGet(() -> {
            VendorGroup newGroup = new VendorGroup(product.getSellerId(), seller.getNom(), new ArrayList<>());
            cart.getVendorGroups().add(newGroup);
            return newGroup;
        });

        // ✅ 7. Check if product already in vendor group
        Optional<CartItem> existingItemOpt = vendorGroup.getItems().stream()
                .filter(i -> i.getProductId().equals(product.getId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = new CartItem(
                    product.getId(),
                    product.getName(),
                    request.getQuantity(),
                    product.getPrice()
            );
            vendorGroup.getItems().add(newItem);
        }

        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    @Override
    public CartResponse getCartByUser(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("🛒 No cart found for user ID: " + userId));
        return buildCartResponse(cart);
    }

    @Override
    public CartResponse removeFromCart(String userId, String vendorId, Long productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("🛒 Cart not found for user ID: " + userId));

        cart.getVendorGroups().forEach(vendor -> {
            if (vendor.getVendorId() != null && vendor.getVendorId().equals(vendorId)) {
                vendor.getItems().removeIf(item -> item.getProductId().equals(productId));
            }
        });

        // Remove vendor group if empty
        cart.getVendorGroups().removeIf(v -> v.getItems().isEmpty());

        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    @Override
    public CartResponse updateQuantity(String userId, String vendorId, Long productId, int quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("🛒 Cart not found for user ID: " + userId));

        for (VendorGroup vendor : cart.getVendorGroups()) {
            if (vendor.getVendorId() != null && vendor.getVendorId().equals(vendorId)) {
                for (CartItem item : vendor.getItems()) {
                    if (item.getProductId().equals(productId)) {
                        if (quantity <= 0) {
                            vendor.getItems().remove(item);
                        } else {
                            item.setQuantity(quantity);
                        }
                        break;
                    }
                }
            }
        }

        cart.getVendorGroups().removeIf(v -> v.getItems().isEmpty());
        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    @Override
    public void clearCart(String userId) {
        cartRepository.findByUserId(userId).ifPresent(cartRepository::delete);
    }

    // 🧮 Helper — Build DTO for frontend
    private CartResponse buildCartResponse(Cart cart) {
        List<VendorGroupResponse> vendorResponses = cart.getVendorGroups().stream().map(vendor -> {
            List<CartItemResponse> items = vendor.getItems().stream()
                    .map(item -> {
                        // Fetch seller information
                        String sellerId = vendor.getVendorId();
                        String sellerName = vendor.getVendorName();
                        
                        // If seller info is not available, try to fetch it
                        if (sellerId != null && (sellerName == null || sellerName.isEmpty())) {
                            try {
                                UserResponse sellerResponse = 
                                    userClient.getSellerById(sellerId);
                                sellerName = sellerResponse.getNom();
                            } catch (Exception e) {
                                // If we can't fetch seller info, use a default
                                sellerName = "Unknown Seller";
                            }
                        }
                        
                        return new CartItemResponse(
                                item.getProductId(),
                                item.getProductName(),
                                sellerId,
                                sellerName,
                                item.getQuantity(),
                                item.getPrice(),
                                item.getPrice() * item.getQuantity()
                        );
                    })
                    .collect(Collectors.toList());

            double vendorTotal = items.stream().mapToDouble(CartItemResponse::getTotal).sum();

            return new VendorGroupResponse(
                    vendor.getVendorId(),
                    vendor.getVendorName(),
                    items,
                    vendorTotal
            );
        }).collect(Collectors.toList());

        double totalPrice = vendorResponses.stream().mapToDouble(VendorGroupResponse::getVendorTotal).sum();

        return new CartResponse(cart.getUserId(), vendorResponses, totalPrice);
    }
}