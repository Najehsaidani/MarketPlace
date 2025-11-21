import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private messages: { sender: string, text: string, timestamp: Date }[] = [];
  messageUpdates$ = new Subject<void>();

  getMessages() {
    return [...this.messages]; // Retourne une copie pour éviter les modifications directes
  }

  sendMessage(sender: string, text: string) {
    this.messages.push({ 
      sender, 
      text, 
      timestamp: new Date() 
    });
    this.messageUpdates$.next();
    
    // Simuler une réponse automatique si l'expéditeur est un client
    if (sender === 'Client') {
      setTimeout(() => {
        this.receiveMessage('Vendeur', 'Merci pour votre message ! Je vais vous répondre dès que possible.');
      }, 1500);
    }
  }
  
  receiveMessage(sender: string, text: string) {
    this.messages.push({ 
      sender, 
      text, 
      timestamp: new Date() 
    });
    this.messageUpdates$.next();
  }
  
  // Méthode pour effacer l'historique des messages
  clearMessages() {
    this.messages = [];
    this.messageUpdates$.next();
  }
}
