import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { ChatNotification } from './chat.model';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
 private client!: Client;
  private messagesSubject = new Subject<ChatNotification>();
  public messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8085/ws'),
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected');

      const userId = localStorage.getItem('userId');
      if (!userId) return;

      this.client.subscribe(`/user/${userId}/queue/messages`, (msg: IMessage) => {
        this.messagesSubject.next(JSON.parse(msg.body));
      });
    };

    this.client.activate();
  }

  sendMessage(msg: { senderId: number, recipientId: number, content: string, chatId?: string }) {
    this.client.publish({
      destination: '/app/chat',
      body: JSON.stringify(msg)
    });
  }
}
