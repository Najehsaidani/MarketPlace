// cart-item-response.model.ts
export interface CartItemResponse {
  productId: number;
  productName: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  price: number;
  total: number;
}

// vendor-group-response.model.ts
export interface VendorGroupResponse {
  vendorId: string;
  vendorName: string;
  items: CartItemResponse[];
  vendorTotal: number;
}

// cart-response.model.ts
export interface CartResponse {
  userId: string;
  vendorGroups: VendorGroupResponse[];
  totalPrice: number;
}

// add-to-cart-request.model.ts
export interface AddToCartRequest {
  userId: string;
  productId: number;
  quantity: number;
}
