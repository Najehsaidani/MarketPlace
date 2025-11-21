package com.SBSS.ProductService.Service.Interface;

import com.SBSS.ProductService.DTO.ProductDTO;


import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductDTO product, Long categoryId);
    ProductDTO getProductById(Long id);
    List<ProductDTO> getAllProducts();
    List<ProductDTO> getProductsByCategory(Long categoryId);
    ProductDTO updateProduct(Long id, ProductDTO product);
    void deleteProduct(Long id);
}