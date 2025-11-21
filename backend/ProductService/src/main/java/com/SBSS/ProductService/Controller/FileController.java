package com.SBSS.ProductService.Controller;

import com.SBSS.ProductService.DTO.ProductDTO;
import com.SBSS.ProductService.Service.Interface.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final ProductImageService productImageService;

    // Upload a single image for a product
    @PostMapping("/upload/{productId}")
    public ResponseEntity<ProductDTO> uploadProductImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "products") String folder) throws IOException {
        
        ProductDTO product = productImageService.uploadProductImage(productId, file, folder);
        return ResponseEntity.ok(product);
    }

    // Upload multiple images for a product
    @PostMapping("/upload/multiple/{productId}")
    public ResponseEntity<ProductDTO> uploadProductImages(
            @PathVariable Long productId,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "folder", defaultValue = "products") String folder) throws IOException {
        
        ProductDTO product = productImageService.uploadProductImages(productId, files, folder);
        return ResponseEntity.ok(product);
    }

    // Update a specific image for a product
    @PutMapping("/update/{productId}")
    public ResponseEntity<ProductDTO> updateProductImage(
            @PathVariable Long productId,
            @RequestParam("oldImageUrl") String oldImageUrl,
            @RequestParam("newFile") MultipartFile newFile,
            @RequestParam(value = "folder", defaultValue = "products") String folder) throws IOException {
        
        ProductDTO product = productImageService.updateProductImage(productId, oldImageUrl, newFile, folder);
        return ResponseEntity.ok(product);
    }

    // Delete a single image for a product
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<ProductDTO> deleteSingleProductImage(
            @PathVariable Long productId,
            @RequestParam("imageUrl") String imageUrl) throws IOException {
        
        ProductDTO product = productImageService.deleteSingleProductImage(productId, imageUrl);
        return ResponseEntity.ok(product);
    }

    // Delete all images for a product
    @DeleteMapping("/delete/all/{productId}")
    public ResponseEntity<ProductDTO> deleteProductImage(@PathVariable Long productId) throws IOException {
        ProductDTO product = productImageService.deleteProductImage(productId);
        return ResponseEntity.ok(product);
    }
}