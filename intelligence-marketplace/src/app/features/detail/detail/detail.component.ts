import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ReviewService } from '../../../services/review/review.service';
import { ChatService } from '../../../services/chat/chat.service';
import { SocketService } from '../../../services/chat/socket.service';
import { Product, ProductImage } from '../../../Types/product.model';
import { ReviewModel } from '../../../services/review/review.model';
import { ChatMessage as ChatMessageModel, ChatUser, ChatNotification } from '../../../services/chat/chat.model';

interface DetailChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  product: Product | null = null;
  selectedImage: ProductImage | null = null;
  reviews: ReviewModel[] = [];
  loading: boolean = true;
  error: string | null = null;
  isChatOpen = false;
  newReview: ReviewModel = {
    userId: '1',
    productId: '',
    rating: 5,
    comment: ''
  };
  isSubmittingReview = false;

  // Chat properties
  messages: DetailChatMessage[] = [];
  newMessage: string = '';
  sellerName: string = 'Vendeur Pro X';
  isLoadingMessages = false;

  private socketSubscription: any;

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private reviewService: ReviewService,
    private chatService: ChatService,
    private socketService: SocketService,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(Number(productId));
      this.loadReviews(productId);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        // Set the first image as selected by default
        if (product.images && product.images.length > 0) {
          this.selectedImage = product.images[0];
        }
        this.newReview.productId = String(id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product details';
        this.loading = false;
        // Fallback to static data if API fails
        this.product = {
          id: id,
          name: `Produit Détaillé ${id}`,
          price: 499.99,
          description: 'Ceci est une description détaillée du produit. Elle doit être complète et mettre en avant les caractéristiques principales, les bénéfices pour l\'utilisateur et les conditions de vente. La sécurité des transactions est assurée par la modération collaborative de la plateforme.'
        };
        this.newReview.productId = String(id);
      }
    });
  }

  loadReviews(productId: string): void {
    this.reviewService.getReviewsByProductId(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        // Fallback to static data if API fails
        this.reviews = [
          {
            id: '1',
            userId: 'user1',
            userName: 'Ahmed Ben Salah',
            productId: productId,
            rating: 4,
            comment: 'Très bon produit, livraison rapide et conforme à la description.',
            createdAt: '2025-10-15'
          },
          {
            id: '2',
            userId: 'user2',
            userName: 'Fatma Zohra',
            productId: productId,
            rating: 5,
            comment: 'Excellent produit, je recommande vivement !',
            createdAt: '2025-10-20'
          },
          {
            id: '3',
            userId: 'user3',
            userName: 'Mohamed Ali',
            productId: productId,
            rating: 3,
            comment: 'Produit correct mais la livraison a pris plus de temps que prévu.',
            createdAt: '2025-10-25'
          }
        ];
      }
    });
  }

  selectImage(image: ProductImage): void {
    this.selectedImage = image;
  }

  submitReview(): void {
    if (!this.newReview.comment.trim()) {
      return;
    }

    this.isSubmittingReview = true;
    this.reviewService.createReview(this.newReview).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReview.rating = 5;
        this.newReview.comment = '';
        this.isSubmittingReview = false;
        alert('Votre avis a été soumis avec succès !');
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.isSubmittingReview = false;
        alert('Erreur lors de la soumission de votre avis. Veuillez réessayer.');
      }
    });
  }

  addToCart() {
    console.log('Add to cart button clicked');
    if (this.product) {
      alert(`Produit ${this.product.name} ajouté au panier !`);
      console.log('Product added to cart:', this.product.name);
    }
  }

  startChat() {
    console.log('Start chat button clicked');
    console.log('Current isChatOpen value:', this.isChatOpen);
    this.isChatOpen = true;
    console.log('New isChatOpen value:', this.isChatOpen);
    // Force change detection
    this.cdr.detectChanges();
    console.log('Change detection triggered');
    console.log('Chat popup should be open now');
    // Connect to WebSocket with default user IDs
    this.socketService.connect(1); // Default client ID
    console.log('WebSocket connection initiated');

    // Add a small delay to ensure connection is established
    setTimeout(() => {
      console.log('Checking WebSocket connection status');
      console.log('WebSocket connected:', this.socketService.isConnected());
    }, 1000);

    // Subscribe to WebSocket messages
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }

    this.socketSubscription = this.socketService.messages$.subscribe(
      (notification: ChatNotification) => {
        console.log('Received chat notification:', notification);
        // Reload messages when a new message arrives
        this.loadChatMessages();
      }
    );

    this.loadChatMessages();
  }

  toggleChat() {
    console.log('Toggle chat called, current state:', this.isChatOpen);
    this.isChatOpen = !this.isChatOpen;
    console.log('New chat state:', this.isChatOpen);
    if (this.isChatOpen) {
      // Connect to WebSocket with default user IDs
      this.socketService.connect(1); // Default client ID

      // Subscribe to WebSocket messages
      if (this.socketSubscription) {
        this.socketSubscription.unsubscribe();
      }

      this.socketSubscription = this.socketService.messages$.subscribe(
        (notification: ChatNotification) => {
          console.log('Received chat notification:', notification);
          // Reload messages when a new message arrives
          this.loadChatMessages();
        }
      );

      this.loadChatMessages();
    } else {
      // Disconnect when closing chat
      this.socketService.disconnect();
      // Unsubscribe from WebSocket messages
      if (this.socketSubscription) {
        this.socketSubscription.unsubscribe();
        this.socketSubscription = null;
      }
    }
  }

  loadChatMessages() {
    console.log('Loading chat messages');
    this.isLoadingMessages = true;
    // In a real application, we would get the seller ID from the product
    // For now, we'll use default IDs
    const clientId = 1;
    const sellerId = 2;

    console.log(`Loading chat messages between client ${clientId} and seller ${sellerId}`);

    this.chatService.getChatMessages(clientId, sellerId).subscribe({
      next: (messages) => {
        console.log('Received chat messages:', messages);
        // Convert to our message format
        this.messages = messages.map(msg => ({
          id: msg.id || '',
          sender: msg.senderName || `User ${msg.senderId}`,
          content: msg.content,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          isOwn: msg.senderId === clientId
        }));
        this.isLoadingMessages = false;
        console.log('Messages updated, total:', this.messages.length);
      },
      error: (error) => {
        console.error('Error loading chat messages:', error);
        // Fallback to static data if API fails
        this.messages = [
          {
            id: '1',
            sender: this.sellerName,
            content: 'Bonjour ! Comment puis-je vous aider avec ce produit ?',
            timestamp: new Date(Date.now() - 3600000),
            isOwn: false
          },
          {
            id: '2',
            sender: 'Moi',
            content: 'Bonjour, je suis intéressé par ce produit. Est-il disponible en stock ?',
            timestamp: new Date(Date.now() - 3500000),
            isOwn: true
          },
          {
            id: '3',
            sender: this.sellerName,
            content: 'Oui, ce produit est actuellement en stock. Nous avons 5 unités disponibles.',
            timestamp: new Date(Date.now() - 3400000),
            isOwn: false
          }
        ];
        this.isLoadingMessages = false;
        console.log('Using fallback messages, total:', this.messages.length);
      }
    });
  }

  sendMessage() {
    console.log('Send message called with:', this.newMessage);
    if (!this.newMessage.trim()) {
      console.log('Message is empty, not sending');
      return;
    }

    console.log('Sending message:', this.newMessage);

    // In a real application, we would get the seller ID from the product
    // For now, we'll use default IDs
    const clientId = 1;
    const sellerId = 2;

    const message: ChatMessageModel = {
      senderId: clientId,
      recipientId: sellerId,
      content: this.newMessage,
      chatId: '' // Will be set by the backend
    };

    // Add to local messages immediately for better UX
    const localMessage: DetailChatMessage = {
      id: Date.now().toString(),
      sender: 'Moi',
      content: this.newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    this.messages.push(localMessage);
    this.newMessage = '';

    // Send via WebSocket
    this.socketService.sendMessage(message);

    // Scroll to bottom
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      }
    } catch(err) {
      console.log(err);
    }
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviews.length;
  }

  getRatingCounts(): { [key: number]: number } {
    const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.reviews.forEach(review => {
      counts[review.rating]++;
    });
    return counts;
  }

  ngOnDestroy() {
    // Disconnect from WebSocket when component is destroyed
    this.socketService.disconnect();
    // Unsubscribe from WebSocket messages
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }
}
