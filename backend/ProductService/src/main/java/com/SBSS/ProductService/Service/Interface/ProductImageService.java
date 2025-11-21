package com.SBSS.ProductService.Service.Interface;

import com.SBSS.ProductService.DTO.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProductImageService {

    ProductDTO uploadProductImage(Long productId, MultipartFile file, String folder) throws IOException;

    // Method for uploading multiple images
    ProductDTO uploadProductImages(Long productId, MultipartFile[] files, String folder) throws IOException;

    // Method for updating a specific image
    ProductDTO updateProductImage(Long productId, String oldImageUrl, MultipartFile newFile, String folder) throws IOException;

    ProductDTO updateProductImage(Long productId, MultipartFile file, String folder) throws IOException;

    // Method for deleting a specific image
    ProductDTO deleteSingleProductImage(Long productId, String imageUrl) throws IOException;

    ProductDTO deleteProductImage(Long productId) throws IOException;
}