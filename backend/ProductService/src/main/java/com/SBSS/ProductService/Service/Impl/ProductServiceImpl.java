package com.SBSS.ProductService.Service.Impl;

import com.SBSS.ProductService.DTO.CategoryDTO;
import com.SBSS.ProductService.DTO.ProductDTO;
import com.SBSS.ProductService.Feign.Seller.UserResponse;
import com.SBSS.ProductService.Feign.Seller.UserSeller;
import com.SBSS.ProductService.Model.Category;
import com.SBSS.ProductService.Model.Product;
import com.SBSS.ProductService.Repository.CategoryRepository;
import com.SBSS.ProductService.Repository.ProductRepository;
import com.SBSS.ProductService.Service.Interface.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserSeller userSeller; // ✅ Inject Feign client

    @Override
    public ProductDTO createProduct(ProductDTO productDTO, Long categoryId) {
        // ✅ 1. Validate category
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("❌ Category not found with id: " + categoryId));

        // ✅ 2. Validate seller from USER-SERVICE
        UserResponse seller;
        try {
            seller = userSeller.getUserById(productDTO.getSellerId().toString());
        } catch (Exception e) {
            throw new RuntimeException("❌ Seller not found in USER-SERVICE with id: " + productDTO.getSellerId());
        }

        // ✅ 3. Build and save product
        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .stockQuantity(productDTO.getStockQuantity())
          
                .images(productDTO.getImages())
                .status(productDTO.getStatus())
                .sellerId(productDTO.getSellerId())
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Product not found with id: " + id));
        return convertToDTO(product);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Product not found with id: " + id));

        // ✅ Validate seller if updated
        if (productDTO.getSellerId() != null) {
            try {
                userSeller.getUserById(productDTO.getSellerId().toString());
            } catch (Exception e) {
                throw new RuntimeException("❌ Seller not found in USER-SERVICE with id: " + productDTO.getSellerId());
            }
        }

        // ✅ Update fields
        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setStockQuantity(productDTO.getStockQuantity());
       
        existingProduct.setImages(productDTO.getImages());
        existingProduct.setStatus(productDTO.getStatus());
        existingProduct.setSellerId(productDTO.getSellerId());

        if (productDTO.getCategory() != null) {
            Category category = categoryRepository.findById(productDTO.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("❌ Category not found with id: " + productDTO.getCategory().getId()));
            existingProduct.setCategory(category);
        }

        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // 🔁 Mapper
    private ProductDTO convertToDTO(Product product) {
        CategoryDTO categoryDTO = null;
        if (product.getCategory() != null) {
            categoryDTO = CategoryDTO.builder()
                    .id(product.getCategory().getId())
                    .name(product.getCategory().getName())
                    .build();
        }

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())

                .images(product.getImages())
                .category(categoryDTO)
                .status(product.getStatus())
                .sellerId(product.getSellerId())
                .build();
    }
}
