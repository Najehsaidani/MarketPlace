import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, BehaviorSubject } from 'rxjs';
import { ChatNotification, ChatMessage } from './chat.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private client!: Client;
  private messagesSubject = new Subject<ChatNotification>();
  public messages$ = this.messagesSubject.asObservable();

  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  constructor() {}

  connect(userId: number) {
    console.log('Attempting to connect to WebSocket with userId:', userId);
    if (this.client && this.client.connected) {
      console.log('Already connected to WebSocket');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8085/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log(new Date(), str);
      }
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected successfully');
      this.connectedSubject.next(true);

      // Subscribe to user-specific messages
      this.client.subscribe(`/user/${userId}/queue/messages`, (msg: IMessage) => {
        try {
          const notification: ChatNotification = JSON.parse(msg.body);
          console.log('Received message notification:', notification);
          this.messagesSubject.next(notification);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket disconnected');
      this.connectedSubject.next(false);
    };

    this.client.onWebSocketClose = (event) => {
      console.log('WebSocket closed:', event);
      this.connectedSubject.next(false);
    };

    this.client.activate();
  }

  disconnect() {
    console.log('Disconnecting WebSocket');
    if (this.client) {
      this.client.deactivate();
      this.connectedSubject.next(false);
    }
  }

  sendMessage(message: ChatMessage) {
    console.log('Sending message via WebSocket:', message);
    if (this.client && this.client.connected) {
      console.log('WebSocket is connected, sending message');
      this.client.publish({
        destination: '/app',
        body: JSON.stringify(message)
      });
      console.log('Message sent successfully');
    } else {
      console.error('WebSocket not connected - cannot send message');
    }
  }

  isConnected(): boolean {
    return this.client && this.client.connected;
  }
}
