import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartResponse, AddToCartRequest } from './cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8888/api/cart'; // API Gateway URL

  constructor(private http: HttpClient) { }

  // Add item to cart
  addToCart(request: AddToCartRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.baseUrl}/add`, request);
  }

  // Get user's cart
  getCart(userId: string): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.baseUrl}/${userId}`);
  }


  removeFromCart(userId: string, vendorId: string, productId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.baseUrl}/${userId}/vendor/${vendorId}/product/${productId}`);
  }


  updateQuantity(userId: string, vendorId: string, productId: number, quantity: number): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.baseUrl}/${userId}/vendor/${vendorId}/product/${productId}?quantity=${quantity}`, {});
  }


  clearCart(userId: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${userId}/clear`);
  }
}
