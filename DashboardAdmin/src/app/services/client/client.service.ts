import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ClientModel,
  ClientLoginModel,
  ClientResponse
} from './client.model';
import { SellerRequestResponse } from './seller-request.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl = 'http://localhost:8888'; // change if needed

  constructor(private http: HttpClient) {}

  // 🔵 Register
  register(client: ClientModel): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(`${this.baseUrl}/client/register`, client);
  }

  // 🟡 Modify client
  modify(id: number, client: ClientModel): Observable<ClientResponse> {
    return this.http.patch<ClientResponse>(`${this.baseUrl}/client/${id}/modify`, client);
  }

  // 🟠 Switch client/seller role
  switchRole(id: number): Observable<ClientResponse> {
    return this.http.patch<ClientResponse>(`${this.baseUrl}/client/${id}/switch`, {});
  }

  // 🟢 Login
  login(data: ClientLoginModel): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(`${this.baseUrl}/client/login`, data);
  }

  // 🔵 Get client by ID
  getClientById(id: number): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.baseUrl}/client/${id}`);
  }

  // 🔵 Get seller request status
  getSellerRequest(id: number): Observable<SellerRequestResponse> {
    return this.http.get<SellerRequestResponse>(`${this.baseUrl}/client/${id}/seller-request`);
  }

  // 🔴 Cancel seller request
  cancelSellerRequest(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/client/${id}/seller-request`);
  }

  // 🔵 Get all clients
  getAllClients(): Observable<ClientResponse[]> {
    const url = `${this.baseUrl}/admin/get_clients`;
    console.log('Fetching clients from:', url);
    return this.http.get<ClientResponse[]>(url);
  }
}
