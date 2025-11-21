import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Types/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';
  private fileApiUrl = '/api/files';

  constructor(private http: HttpClient) { }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, product);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // File upload methods
  uploadProductImage(productId: number, file: File, folder: string = 'products'): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return this.http.post<Product>(`${this.fileApiUrl}/upload/${productId}`, formData);
  }

  uploadProductImages(productId: number, files: File[], folder: string = 'products'): Observable<Product> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folder', folder);
    return this.http.post<Product>(`${this.fileApiUrl}/upload/multiple/${productId}`, formData);
  }

  updateProductImage(productId: number, oldImageUrl: string, newFile: File, folder: string = 'products'): Observable<Product> {
    const formData = new FormData();
    formData.append('oldImageUrl', oldImageUrl);
    formData.append('newFile', newFile);
    formData.append('folder', folder);
    return this.http.put<Product>(`${this.fileApiUrl}/update/${productId}`, formData);
  }

  deleteSingleProductImage(productId: number, imageUrl: string): Observable<Product> {
    return this.http.delete<Product>(`${this.fileApiUrl}/delete/${productId}?imageUrl=${encodeURIComponent(imageUrl)}`);
  }

  deleteAllProductImages(productId: number): Observable<Product> {
    return this.http.delete<Product>(`${this.fileApiUrl}/delete/all/${productId}`);
  }
}