import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewModel } from './review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private baseUrl = 'http://localhost:8888/api/reviews'; // change to gateway if needed

  constructor(private http: HttpClient) {}

  // 🔵 Get all reviews
  getAllReviews(): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(this.baseUrl);
  }

  // 🔵 Get review by ID
  getReviewById(id: string): Observable<ReviewModel> {
    return this.http.get<ReviewModel>(`${this.baseUrl}/${id}`);
  }

  // 🔵 Get reviews by product ID
  getReviewsByProductId(productId: string): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.baseUrl}/product/${productId}`);
  }

  // 🔵 Get reviews by user ID
  getReviewsByUserId(userId: string): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.baseUrl}/user/${userId}`);
  }

  // 🟢 Create review
  createReview(review: ReviewModel): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(this.baseUrl, review);
  }

  // 🟡 Update review
  updateReview(id: string, review: ReviewModel): Observable<ReviewModel> {
    return this.http.put<ReviewModel>(`${this.baseUrl}/${id}`, review);
  }

  // 🔴 Delete review
  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
