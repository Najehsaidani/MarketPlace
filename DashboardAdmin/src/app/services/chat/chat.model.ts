export interface Chat {
}
export interface ChatUser {
  id: number;
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  statut?: string;
  estVendeur?: boolean;
  imageUrl?: string;
}
export interface ChatNotification {
  id: string;
  senderId: number;
  recipientId: number;
  content: string;
}
export interface ChatMessage {
  id?: string;
  chatId: string;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp?: string;
  senderName?: string;
}
export interface ChatRoom {
  id?: string;
  chatId: string;
  senderId: number;
  recipientId: number;
}
