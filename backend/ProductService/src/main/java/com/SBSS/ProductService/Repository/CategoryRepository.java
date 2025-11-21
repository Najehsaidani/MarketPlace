package com.SBSS.ProductService.Repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.SBSS.ProductService.Model.Category;

import org.springframework.stereotype.Repository;
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
}
