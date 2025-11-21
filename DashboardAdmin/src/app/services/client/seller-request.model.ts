export interface SellerRequestModel {
  client: number;
}

export interface SellerRequestResponse {
  id: number;
  client: number;
  accepted: boolean;
}
