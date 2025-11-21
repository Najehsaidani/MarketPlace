export interface ReviewModel {
  id?: string;
  userId: string;
  userName?: string;
  userImageUrl?: string;
  productId: string;
  productName?: string;
  rating: number;
  comment: string;
  createdAt?: string; // LocalDateTime → string in JSON
}
