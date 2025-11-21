import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientModel, ClientResponse } from '../client/client.model';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private baseUrl = 'http://localhost:8888'; // change if needed

  constructor(private http: HttpClient) {}

  // 🔵 Get seller by ID
  getSellerById(id: number): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.baseUrl}/seller/${id}`);
  }

  // 🔵 Get all sellers
  getAllSellers(): Observable<ClientResponse[]> {
    const url = `${this.baseUrl}/seller`;
    console.log('Fetching sellers from:', url);
    return this.http.get<ClientResponse[]>(url);
  }

  // 🟡 Modify seller information
  modifySeller(id: number, data: ClientModel): Observable<ClientResponse> {
    return this.http.patch<ClientResponse>(`${this.baseUrl}/seller/${id}/modify`, data);
  }

  // 🔴 Delete seller (switch role back to client)
  deleteSeller(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/seller/${id}`);
  }
}
