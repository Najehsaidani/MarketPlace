import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { CategoryService } from '../../../../services/categories/categories.service';
import { Category } from '../../../../services/categories/categories.model';

// Extended interface for local use
interface CategoryWithStatus extends Category {
  productsCount?: number;
  status?: string;
}

@Component({
  selector: 'app-product-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, HttpClientModule],
  templateUrl: './product-categories.component.html',
  styleUrls: ['./product-categories.component.css']
})
export class ProductCategoriesComponent implements OnInit {
  categories: CategoryWithStatus[] = [];

  // Formulaire pour ajouter/modifier une catégorie
  categoryForm = {
    name: '',
    status: 'active'
  };

  // États pour les modales
  showAddModal = false;
  showEditModal = false;
  editingCategory: CategoryWithStatus | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (backendCategories: Category[]) => {
        // Transform backend categories to match our local CategoryWithStatus interface
        this.categories = backendCategories.map(category => ({
          id: category.id,
          name: category.name,
          productsCount: category.products?.length || 0,
          status: 'active' // Defaulting to active since backend doesn't provide status
        }));
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Fallback to mock data if backend fails
        this.categories = [
          { id: 1, name: 'Tapis', productsCount: 45, status: 'active' },
          { id: 2, name: 'Poteries', productsCount: 32, status: 'active' },
          { id: 3, name: 'Bijoux', productsCount: 28, status: 'active' },
          { id: 4, name: 'Vêtements traditionnels', productsCount: 19, status: 'inactive' },
          { id: 5, name: 'Lampes', productsCount: 15, status: 'active' },
          { id: 6, name: 'Cuirs', productsCount: 12, status: 'active' },
          { id: 7, name: 'Objets de décoration', productsCount: 23, status: 'active' },
          { id: 8, name: 'Instruments de musique', productsCount: 8, status: 'inactive' }
        ];
      }
    });
  }

  // Ouvrir la modale d'ajout
  openAddModal() {
    this.resetForm();
    this.showAddModal = true;
  }

  // Ouvrir la modale de modification
  openEditModal(category: CategoryWithStatus) {
    this.editingCategory = category;
    this.categoryForm.name = category.name;
    this.categoryForm.status = category.status || 'active';
    this.showEditModal = true;
  }

  // Fermer les modales
  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.resetForm();
  }

  // Réinitialiser le formulaire
  resetForm() {
    this.categoryForm.name = '';
    this.categoryForm.status = 'active';
    this.editingCategory = null;
  }

  // Ajouter une nouvelle catégorie
  addCategory() {
    if (this.categoryForm.name.trim()) {
      const newCategory: Category = {
        name: this.categoryForm.name
      };

      // Call backend service to create the category
      this.categoryService.createCategory(newCategory).subscribe({
        next: (createdCategory: Category) => {
          // Add to local state
          this.categories.push({
            id: createdCategory.id,
            name: createdCategory.name,
            productsCount: 0,
            status: this.categoryForm.status
          });
          this.closeModals();
        },
        error: (error: any) => {
          console.error('Error creating category:', error);
          // Show error message to user
          alert('Error creating category. Please try again.');
        }
      });
    }
  }

  // Mettre à jour une catégorie
  updateCategory() {
    if (this.editingCategory && this.categoryForm.name.trim()) {
      const updatedCategory: Category = {
        id: this.editingCategory.id,
        name: this.categoryForm.name
      };

      // Call backend service to update the category
      this.categoryService.updateCategory(this.editingCategory.id!, updatedCategory).subscribe({
        next: (category: Category) => {
          // Update local state
          const index = this.categories.findIndex(c => c.id === this.editingCategory?.id);
          if (index !== -1) {
            this.categories[index] = {
              ...this.categories[index],
              name: category.name,
              status: this.categoryForm.status
            };
          }
          this.closeModals();
        },
        error: (error: any) => {
          console.error('Error updating category:', error);
          // Show error message to user
          alert('Error updating category. Please try again.');
        }
      });
    }
  }

  // Supprimer une catégorie
  deleteCategory(id: number | undefined) {
    if (id === undefined) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      // Call backend service to delete the category
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          // Remove from local state
          this.categories = this.categories.filter(c => c.id !== id);
        },
        error: (error: any) => {
          console.error('Error deleting category:', error);
          // Show error message to user
          alert('Error deleting category. Please try again.');
        }
      });
    }
  }

  // Activer/désactiver une catégorie
  toggleCategoryStatus(id: number | undefined) {
    if (id === undefined) return;
    const category = this.categories.find(c => c.id === id);
    if (category) {
      // Toggle status locally
      const newStatus = category.status === 'active' ? 'inactive' : 'active';
      category.status = newStatus;

      // Call backend service to persist the change
      this.categoryService.updateCategoryStatus(id, newStatus).subscribe({
        next: () => {
          console.log(`Category ${id} status updated to ${newStatus} successfully`);
        },
        error: (error: any) => {
          console.error(`Error updating category ${id} status:`, error);
          // Revert local change if backend fails
          category.status = category.status === 'active' ? 'inactive' : 'active';
        }
      });
    }
  }

  // Helper methods for stats
  getActiveCategoriesCount(): number {
    return this.categories.filter(c => c.status === 'active').length;
  }

  getInactiveCategoriesCount(): number {
    return this.categories.filter(c => c.status === 'inactive').length;
  }

  getTotalProductsCount(): number {
    return this.categories.reduce((sum, category) => sum + (category.productsCount || 0), 0);
  }

  // Helper methods for status display
  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      default: return 'status-default';
    }
  }

  getStatusIcon(status: string | undefined): string {
    switch (status) {
      case 'active': return 'bx-check-circle';
      case 'inactive': return 'bx-toggle-left';
      default: return 'bx-help-circle';
    }
  }
}
