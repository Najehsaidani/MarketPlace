import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatMessage, ChatUser } from './chat.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = 'http://localhost:8085/api/chat';
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private usersSubject = new BehaviorSubject<ChatUser[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get chat messages between two users
  getChatMessages(senderId: number, recipientId: number): Observable<ChatMessage[]> {
    console.log(`Fetching chat messages between ${senderId} and ${recipientId}`);
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/messages/${senderId}/${recipientId}`);
  }

  // Validate if a user exists
  validateUser(id: number): Observable<boolean> {
    console.log(`Validating user with ID: ${id}`);
    return this.http.get<boolean>(`${this.baseUrl}/validate-user/${id}`);
  }

  // Get user details
  getUser(id: number): Observable<ChatUser> {
    console.log(`Fetching user details for ID: ${id}`);
    return this.http.get<ChatUser>(`${this.baseUrl}/user/${id}`);
  }

  // Get all clients
  getAllClients(): Observable<ChatUser[]> {
    console.log('Fetching all clients');
    return this.http.get<ChatUser[]>(`${this.baseUrl}/clients`);
  }

  // Get all sellers
  getAllSellers(): Observable<ChatUser[]> {
    console.log('Fetching all sellers');
    return this.http.get<ChatUser[]>(`${this.baseUrl}/sellers`);
  }

  // Get all users (clients and sellers)
  getAllUsers(): Observable<ChatUser[]> {
    console.log('Fetching all users');
    return this.http.get<ChatUser[]>(`${this.baseUrl}/users`);
  }

  // Send a chat message
  sendMessage(message: ChatMessage): Observable<ChatMessage> {
    console.log('Sending chat message via HTTP:', message);
    return this.http.post<ChatMessage>(`${this.baseUrl}/send`, message);
  }

  // Update messages in the service
  updateMessages(messages: ChatMessage[]) {
    this.messagesSubject.next(messages);
  }

  // Update users in the service
  updateUsers(users: ChatUser[]) {
    this.usersSubject.next(users);
  }

  // Clear messages
  clearMessages() {
    this.messagesSubject.next([]);
  }
}
