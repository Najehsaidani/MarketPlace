import { Category } from '../categories/categories.model';

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stockQuantity?: number;
  imageUrl?: string;
  imagePublicId?: string;
  images?: ProductImage[];
  category?: Category;
  categoryId?: number;
  categoryName?: string;
  status?: string;
  sellerId?: number;
}
