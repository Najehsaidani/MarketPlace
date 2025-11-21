package com.SBSS.ProductService.Model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    private BigDecimal price;
    private int stockQuantity;
    @ElementCollection
    private List<ProductImage> images = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    private String status;
    private Long sellerId;


}