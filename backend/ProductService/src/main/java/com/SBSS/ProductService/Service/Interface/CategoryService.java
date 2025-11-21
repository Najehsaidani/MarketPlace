package com.SBSS.ProductService.Service.Interface;




import java.util.List;

import com.SBSS.ProductService.DTO.CategoryDTO;
import com.SBSS.ProductService.Model.Category;

public interface CategoryService {
    CategoryDTO createCategory(Category category);
    CategoryDTO getCategoryById(Long id);
    List<CategoryDTO> getAllCategories();
    void deleteCategory(Long id);
}
