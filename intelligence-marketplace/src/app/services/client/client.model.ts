export interface ClientModel {
  nom: string;
  email: string;
  motDePasse: string;
  statut?: 'ACTIVE' | 'INACTIVE';
  adresse?: string | null;
  telephone?: string | null;
  ImageUrl?: string | null;
  estVendeur?: boolean;
}

export interface ClientLoginModel {
  email: string;
  motDePasse: string;
}

export interface ClientResponse {
  id: number;
  nom: string;
  email: string;
  statut: 'ACTIVE' | 'INACTIVE';
  adresse?: string | null;
  telephone?: string | null;
  estVendeur: boolean;
  ImageUrl?: string | null;
}
