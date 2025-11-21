package com.SBSS.ProductService.Service.Impl;

import com.SBSS.ProductService.DTO.CategoryDTO;
import com.SBSS.ProductService.DTO.ProductDTO;
import com.SBSS.ProductService.Model.Product;
import com.SBSS.ProductService.Model.ProductImage;
import com.SBSS.ProductService.Repository.ProductRepository;
import com.SBSS.ProductService.Service.Interface.ProductImageService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final Cloudinary cloudinary;
    private final ProductRepository productRepository;

    private final List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png", "webp", "avif");

    @Override
    public ProductDTO uploadProductImage(Long productId, MultipartFile file, String folder) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));

        validateFileExtension(file);

        // Upload to Cloudinary
        @SuppressWarnings("unchecked")
        Map<String, Object> resultUpload = (Map<String, Object>) cloudinary.uploader().upload(
                file.getBytes(), ObjectUtils.asMap("folder", folder));

        // Initialize images list if null
        if (product.getImages() == null) {
            product.setImages(new ArrayList<>());
        }

        String secureUrl = resultUpload.get("secure_url").toString();
        String publicId = resultUpload.get("public_id").toString();
        product.getImages().add(new ProductImage(secureUrl, publicId));

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Override
    public ProductDTO uploadProductImages(Long productId, MultipartFile[] files, String folder) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));

        if (product.getImages() == null) {
            product.setImages(new ArrayList<>());
        }

        for (MultipartFile file : files) {
            validateFileExtension(file);

            @SuppressWarnings("unchecked")
            Map<String, Object> resultUpload = (Map<String, Object>) cloudinary.uploader().upload(
                    file.getBytes(), ObjectUtils.asMap("folder", folder));

            String secureUrl = resultUpload.get("secure_url").toString();
            String publicId = resultUpload.get("public_id").toString();
            product.getImages().add(new ProductImage(secureUrl, publicId));
        }

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, String oldImageUrl, MultipartFile newFile, String folder) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));

        if (product.getImages() == null) {
            product.setImages(new ArrayList<>());
        }

        // Search for the old image using URL
        ProductImage oldImage = null;
        for (ProductImage img : product.getImages()) {
            if (img.getUrl().equals(oldImageUrl)) {
                oldImage = img;
                break;
            }
        }

        if (oldImage == null) {
            throw new RuntimeException("Old image URL not found");
        }

        validateFileExtension(newFile);

        // Delete the old image from Cloudinary
        cloudinary.uploader().destroy(oldImage.getPublicId(), ObjectUtils.emptyMap());

        // Upload the new image
        @SuppressWarnings("unchecked")
        Map<String, Object> resultUpload = (Map<String, Object>) cloudinary.uploader().upload(
                newFile.getBytes(), ObjectUtils.asMap("folder", folder));

        String newSecureUrl = resultUpload.get("secure_url").toString();
        String newPublicId = resultUpload.get("public_id").toString();

        // Remove the old image and add the new one
        product.getImages().remove(oldImage);
        product.getImages().add(new ProductImage(newSecureUrl, newPublicId));

        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile file, String folder) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));

        

        // Upload new image
        return uploadProductImage(productId, file, folder);
    }

    @Override
    public ProductDTO deleteSingleProductImage(Long productId, String imageUrl) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));

        if (product.getImages() != null) {
            ProductImage imageToRemove = null;
            for (ProductImage img : product.getImages()) {
                if (img.getUrl().equals(imageUrl)) {
                    imageToRemove = img;
                    break;
                }
            }

            if (imageToRemove != null) {
                // Delete the image from Cloudinary
                cloudinary.uploader().destroy(imageToRemove.getPublicId(), ObjectUtils.emptyMap());
                product.getImages().remove(imageToRemove);

                Product savedProduct = productRepository.save(product);
                return convertToDTO(savedProduct);
            }
        }

        throw new RuntimeException("Image URL not found for product with id " + productId);
    }

    @Override
    public ProductDTO deleteProductImage(Long productId) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));

        if (product.getImages() != null) {
            // Delete all images from Cloudinary
            for (ProductImage img : product.getImages()) {
                cloudinary.uploader().destroy(img.getPublicId(), ObjectUtils.emptyMap());
            }
            product.getImages().clear();
        }
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    // Helper method to validate file extension
    private void validateFileExtension(MultipartFile file) {
        String extension = null;
        if (file.getOriginalFilename() != null) {
            String[] splitName = file.getOriginalFilename().split("\\.");
            extension = splitName[splitName.length - 1].toLowerCase();
        }
        if (!allowedExtensions.contains(extension)) {
            throw new RuntimeException(String.format("Extension %s not allowed.", extension));
        }
    }
    
    // Helper method to convert Product entity to ProductDTO
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