import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat/chat.service';
import { SocketService } from '../../services/chat/socket.service';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatUser, ChatNotification } from '../../services/chat/chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  users: ChatUser[] = [];
  newMessage = '';
  currentUserId = 1; // Default user ID
  recipientId = 2; // Default recipient ID
  isConnected = false;

  private messageSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;
  private socketSubscription: Subscription | undefined;

  constructor(
    private chatService: ChatService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    // Connect to WebSocket
    this.socketService.connect(this.currentUserId);

    // Subscribe to connection status
    this.socketService.connected$.subscribe(connected => {
      this.isConnected = connected;
      console.log('WebSocket connection status:', connected);
    });

    // Subscribe to incoming messages
    this.socketSubscription = this.socketService.messages$.subscribe(
      (notification: ChatNotification) => {
        console.log('Received notification:', notification);
        // Fetch updated messages
        this.loadMessages();
      }
    );

    // Load initial messages
    this.loadMessages();

    // Load users
    this.loadUsers();
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.socketService.disconnect();
  }

  loadMessages() {
    this.chatService.getChatMessages(this.currentUserId, this.recipientId)
      .subscribe({
        next: (messages) => {
          this.messages = messages;
          console.log('Loaded messages:', messages);
        },
        error: (error) => {
          console.error('Error loading messages:', error);
        }
      });
  }

  loadUsers() {
    this.chatService.getAllUsers()
      .subscribe({
        next: (users) => {
          this.users = users;
          console.log('Loaded users:', users);
        },
        error: (error) => {
          console.error('Error loading users:', error);
        }
      });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.isConnected) {
      const message: ChatMessage = {
        senderId: this.currentUserId,
        recipientId: this.recipientId,
        content: this.newMessage,
        chatId: `${Math.min(this.currentUserId, this.recipientId)}_${Math.max(this.currentUserId, this.recipientId)}`
      };

      console.log('Sending message:', message);
      this.socketService.sendMessage(message);
      this.newMessage = '';
    }
  }

  switchUser() {
    // Switch between sender and recipient
    const temp = this.currentUserId;
    this.currentUserId = this.recipientId;
    this.recipientId = temp;

    // Reload messages for the new user pair
    this.loadMessages();

    // Reconnect with new user ID
    this.socketService.disconnect();
    this.socketService.connect(this.currentUserId);
  }
}
