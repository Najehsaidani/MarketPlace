import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { ProductService as BackendProductService } from '../../../../services/product/product.service';
import { Product as BackendProduct } from '../../../../services/product/product.model';

// Define the local Product interface that matches the admin component needs
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: { url: string; publicId: string }[];
  sellerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  categoryName?: string;
  stockQuantity?: number;
  inStock?: boolean;
  onSale?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, FormsModule, HttpClientModule]
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  showProductModal = false;
  showAddProductForm = false;
  notificationMessage = '';
  notificationType = '';
  searchTerm = '';
  statusFilter = 'ALL';
  sortBy = 'name';
  categories: string[] = [];
  selectedCategory = 'all';

  // Form data for adding/editing products
  productForm: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    image: '',
    categoryName: '',
    stockQuantity: 0,
    inStock: true,
    onSale: false,
    sellerId: ''
  };

  isFormValid = false;

  constructor(private backendProductService: BackendProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.backendProductService.getAllProducts().subscribe({
      next: (backendProducts: BackendProduct[]) => {
        // Transform backend products to match our local Product interface
        this.products = backendProducts.map(product => ({
          id: product.id || 0,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.imageUrl || 'assets/images/default-product.png',
          images: product.images || [],
          sellerId: product.sellerId?.toString() || '',
          status: (product.status as 'PENDING' | 'APPROVED' | 'REJECTED') || 'PENDING',
          categoryName: product.categoryName || product.category?.name || 'Non classé',
          stockQuantity: product.stockQuantity || 0,
          inStock: (product.stockQuantity || 0) > 0,
          onSale: false, // Not provided by backend, defaulting to false
          averageRating: 0, // Not provided by backend, would need separate API call
          reviewCount: 0 // Not provided by backend, would need separate API call
        }));
        this.filteredProducts = [...this.products];
        this.extractCategories();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // Fallback to mock data if backend fails
        this.products = [
          {
            id: 1,
            name: 'Produit Exemple 1',
            description: 'Description du produit exemple 1 avec des détails complets',
            price: 29.99,
            image: 'assets/images/logo.png',
            images: [
              { url: 'assets/images/logo.png', publicId: 'logo1' },
              { url: 'assets/images/logo.png', publicId: 'logo2' }
            ],
            sellerId: 'seller-1',
            status: 'PENDING',
            categoryName: 'Électronique',
            stockQuantity: 15,
            inStock: true,
            onSale: false,
            averageRating: 4.5,
            reviewCount: 12
          }
        ];
        this.filteredProducts = [...this.products];
        this.extractCategories();
      }
    });
  }

  extractCategories() {
    const categories = new Set<string>();
    this.products.forEach(product => {
      if (product.categoryName) {
        categories.add(product.categoryName);
      }
    });
    this.categories = Array.from(categories);
  }

  acceptProduct(id: number) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      // Update local state immediately for better UX
      product.status = 'APPROVED';
      this.notificationMessage = `Product with ID ${id} approved successfully`;
      this.notificationType = 'success';
      this.applyFilters();

      // Call backend service to persist the change
      this.backendProductService.updateProductStatus(id, 'APPROVED').subscribe({
        next: () => {
          console.log(`Product ${id} approved successfully`);
        },
        error: (error: any) => {
          console.error(`Error approving product ${id}:`, error);
          // Revert local change if backend fails
          product.status = 'PENDING';
          this.notificationMessage = `Error approving product with ID ${id}`;
          this.notificationType = 'error';
        }
      });
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000);
  }

  rejectProduct(id: number) {
    const product = this.products.find(p => p.id === id);
    if (product) {
      // Update local state immediately for better UX
      product.status = 'REJECTED';
      this.notificationMessage = `Product with ID ${id} rejected`;
      this.notificationType = 'error';
      this.applyFilters();

      // Call backend service to persist the change
      this.backendProductService.updateProductStatus(id, 'REJECTED').subscribe({
        next: () => {
          console.log(`Product ${id} rejected successfully`);
        },
        error: (error: any) => {
          console.error(`Error rejecting product ${id}:`, error);
          // Revert local change if backend fails
          product.status = 'PENDING';
          this.notificationMessage = `Error rejecting product with ID ${id}`;
          this.notificationType = 'error';
        }
      });
    }

    // Clear notification after 3 seconds
    setTimeout(() => {
      this.notificationMessage = '';
    }, 3000);
  }

  changeProductStatus(id: number, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    const product = this.products.find(p => p.id === id);
    if (product) {
      // Update local state immediately for better UX
      product.status = status;
      this.notificationMessage = `Product status changed to ${status}`;
      this.notificationType = 'success';
      this.applyFilters();

      // Update selected product if it's the same one
      if (this.selectedProduct && this.selectedProduct.id === id) {
        const updatedProduct = this.products.find(p => p.id === id);
        this.selectedProduct = updatedProduct || null;
      }

      // Call backend service to persist the change
      this.backendProductService.updateProductStatus(id, status).subscribe({
        next: () => {
          console.log(`Product ${id} status updated to ${status} successfully`);
        },
        error: (error: any) => {
          console.error(`Error updating product ${id} status:`, error);
          // Revert local change if backend fails
          product.status = product.status === 'APPROVED' ? 'REJECTED' :
                         product.status === 'REJECTED' ? 'PENDING' : 'APPROVED';
          this.notificationMessage = `Error updating product status with ID ${id}`;
          this.notificationType = 'error';
        }
      });

      // Clear notification after 3 seconds
      setTimeout(() => {
        this.notificationMessage = '';
      }, 3000);
    }
  }

  viewProductDetails(product: Product) {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  openAddProductForm() {
    this.showAddProductForm = true;
    this.resetForm();
  }

  closeAddProductForm() {
    this.showAddProductForm = false;
    this.resetForm();
  }

  resetForm() {
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      image: '',
      categoryName: '',
      stockQuantity: 0,
      inStock: true,
      onSale: false,
      sellerId: ''
    };
    this.isFormValid = false;
  }

  onFormInputChange() {
    this.isFormValid = !!(
      this.productForm.name &&
      this.productForm.description &&
      this.productForm.price &&
      this.productForm.price > 0 &&
      this.productForm.categoryName &&
      this.productForm.sellerId
    );
  }

  submitProductForm() {
    if (this.isFormValid) {
      const newProduct: BackendProduct = {
        name: this.productForm.name!,
        description: this.productForm.description!,
        price: this.productForm.price!,
        stockQuantity: this.productForm.stockQuantity,
        categoryName: this.productForm.categoryName,
        sellerId: parseInt(this.productForm.sellerId || '0')
      };

      // Call backend service to create the product
      this.backendProductService.createProduct(newProduct).subscribe({
        next: (createdProduct: BackendProduct) => {
          // Add to local state
          this.products.push({
            id: createdProduct.id || Math.max(...this.products.map(p => p.id), 0) + 1,
            name: createdProduct.name,
            description: createdProduct.description,
            price: createdProduct.price,
            image: createdProduct.imageUrl || 'assets/images/default-product.png',
            images: createdProduct.images || [],
            sellerId: createdProduct.sellerId?.toString() || '',
            status: 'PENDING',
            categoryName: createdProduct.categoryName || createdProduct.category?.name || 'Non classé',
            stockQuantity: createdProduct.stockQuantity || 0,
            inStock: (createdProduct.stockQuantity || 0) > 0,
            onSale: false,
            averageRating: 0,
            reviewCount: 0
          });
          this.applyFilters();
          this.extractCategories();

          this.notificationMessage = `Product "${this.productForm.name}" added successfully`;
          this.notificationType = 'success';
          this.closeAddProductForm();
        },
        error: (error: any) => {
          console.error('Error creating product:', error);
          this.notificationMessage = `Error adding product "${this.productForm.name}"`;
          this.notificationType = 'error';
        }
      });

      // Clear notification after 3 seconds
      setTimeout(() => {
        this.notificationMessage = '';
      }, 3000);
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           (product.categoryName && product.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesStatus = this.statusFilter === 'ALL' || product.status === this.statusFilter;
      const matchesCategory = this.selectedCategory === 'all' || product.categoryName === this.selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Apply sorting
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'stock':
          return (a.stockQuantity || 0) - (b.stockQuantity || 0);
        default:
          return 0;
      }
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onCategoryFilterChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  // Event handlers for input changes
  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.onSearchChange();
  }

  onStatusFilterInput(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.statusFilter = target.value;
    this.onStatusFilterChange();
  }

  onCategoryFilterInput(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    this.onCategoryFilterChange();
  }

  onSortInput(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortBy = target.value;
    this.onSortChange();
  }

  // New functionality - Remove product
  removeProduct(id: number) {
    if (confirm('Are you sure you want to remove this product?')) {
      // Remove from local state immediately for better UX
      this.products = this.products.filter(p => p.id !== id);
      this.applyFilters();
      this.notificationMessage = `Product removed successfully`;
      this.notificationType = 'success';

      // If we're viewing the details of the removed product, close the modal
      if (this.selectedProduct && this.selectedProduct.id === id) {
        this.closeProductModal();
      }

      // Call backend service to persist the change
      this.backendProductService.deleteProduct(id).subscribe({
        next: () => {
          console.log(`Product ${id} deleted successfully`);
        },
        error: (error: any) => {
          console.error(`Error deleting product ${id}:`, error);
          // Note: We don't revert the local change since deletion is destructive
          this.notificationMessage = `Error deleting product with ID ${id}`;
          this.notificationType = 'error';
        }
      });

      // Clear notification after 3 seconds
      setTimeout(() => {
        this.notificationMessage = '';
      }, 3000);
    }
  }

  // Dropdown methods for mobile
  toggleDropdown(event: Event) {
    event.stopPropagation();
    const dropdown = event.currentTarget as HTMLElement;
    dropdown.classList.toggle('active');
  }

  closeDropdown(event: Event) {
    event.stopPropagation();
    const dropdown = event.currentTarget as HTMLElement;
    // Traverse up to find the dropdown container
    let parent = dropdown.parentElement;
    while (parent && !parent.classList.contains('actions-dropdown')) {
      parent = parent.parentElement;
    }
    if (parent) {
      parent.classList.remove('active');
    }
  }

  // Stats calculation
  get totalProducts() {
    return this.products.length;
  }

  get inStockProducts() {
    return this.products.filter(p => p.inStock).length;
  }

  get outOfStockProducts() {
    return this.products.filter(p => !p.inStock).length;
  }

  get pendingProducts() {
    return this.products.filter(p => p.status === 'PENDING').length;
  }
}
