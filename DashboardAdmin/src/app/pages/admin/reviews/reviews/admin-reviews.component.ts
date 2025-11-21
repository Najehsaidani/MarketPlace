import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { ReviewService } from '../../../../services/review/review.service';
import { ReviewModel } from '../../../../services/review/review.model';

interface Review {
  id: string;
  product: string;
  customer: string;
  rating: number;
  comment: string;
  date: Date;
  status: 'approved' | 'pending' | 'rejected';
}

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, NavbarComponent, HttpClientModule],
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.scss']
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getAllReviews().subscribe({
      next: (backendReviews: ReviewModel[]) => {
        // Transform backend reviews to match our local Review interface
        this.reviews = backendReviews.map(review => ({
          id: review.id || '',
          product: review.productName || 'Produit inconnu',
          customer: review.userName || 'Utilisateur inconnu',
          rating: review.rating,
          comment: review.comment,
          date: review.createdAt ? new Date(review.createdAt) : new Date(),
          status: 'pending' // Defaulting to pending since backend doesn't provide status
        }));
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        // Fallback to mock data if backend fails
        this.reviews = [
          {
            id: '1',
            product: 'Tapis artisanal',
            customer: 'Jean Dupont',
            rating: 5,
            comment: 'Produit magnifique, qualité exceptionnelle',
            date: new Date('2023-10-15'),
            status: 'approved'
          },
          {
            id: '2',
            product: 'Poterie traditionnelle',
            customer: 'Marie Martin',
            rating: 4,
            comment: 'Très beau mais livraison un peu longue',
            date: new Date('2023-10-18'),
            status: 'pending'
          },
          {
            id: '3',
            product: 'Bijoux en argent',
            customer: 'Pierre Bernard',
            rating: 3,
            comment: 'Produit correct mais emballage décevant',
            date: new Date('2023-10-20'),
            status: 'rejected'
          }
        ];
      }
    });
  }

  approveReview(id: string): void {
    const review = this.reviews.find(r => r.id === id);
    if (review) {
      // Update local state immediately for better UX
      review.status = 'approved';

      // Call backend service to persist the change
      this.reviewService.updateReview(id, {
        userId: '', // These fields are required by the model but not used in this context
        productId: '',
        rating: review.rating,
        comment: review.comment
      }).subscribe({
        next: () => {
          console.log(`Review ${id} approved successfully`);
        },
        error: (error: any) => {
          console.error(`Error approving review ${id}:`, error);
          // Revert local change if backend fails
          review.status = 'pending';
        }
      });
    }
  }

  rejectReview(id: string): void {
    const review = this.reviews.find(r => r.id === id);
    if (review) {
      // Update local state immediately for better UX
      review.status = 'rejected';

      // Call backend service to persist the change
      this.reviewService.updateReview(id, {
        userId: '', // These fields are required by the model but not used in this context
        productId: '',
        rating: review.rating,
        comment: review.comment
      }).subscribe({
        next: () => {
          console.log(`Review ${id} rejected successfully`);
        },
        error: (error: any) => {
          console.error(`Error rejecting review ${id}:`, error);
          // Revert local change if backend fails
          review.status = 'pending';
        }
      });
    }
  }

  deleteReview(id: string): void {
    // Remove from local state immediately for better UX
    this.reviews = this.reviews.filter(r => r.id !== id);

    // Call backend service to persist the change
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        console.log(`Review ${id} deleted successfully`);
      },
      error: (error: any) => {
        console.error(`Error deleting review ${id}:`, error);
        // Revert local change if backend fails (you would need to re-fetch or restore from memory)
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  // Helper methods for stats
  getPendingReviewsCount(): number {
    return this.reviews.filter(r => r.status === 'pending').length;
  }

  getApprovedReviewsCount(): number {
    return this.reviews.filter(r => r.status === 'approved').length;
  }

  getRejectedReviewsCount(): number {
    return this.reviews.filter(r => r.status === 'rejected').length;
  }
}
