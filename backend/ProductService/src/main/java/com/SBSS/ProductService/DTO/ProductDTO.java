package com.SBSS.ProductService.DTO;

import com.SBSS.ProductService.Model.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private List<ProductImage> images = new ArrayList<>();
    private CategoryDTO category; // Use CategoryDTO instead of Category entity
    private String status;
    private Long sellerId;
}