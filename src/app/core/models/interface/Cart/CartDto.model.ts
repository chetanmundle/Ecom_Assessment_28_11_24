export interface AddToCartDto {
  userId: number;
  productId: number;
  quntity: number;
}

export interface CartITemsWithDetails {
  productId: number;
  cartMasterId: number;
  userId: number;
  cartDetailsId: number;
  quntity: number;
  productName: string;
  productImage: string;
  sellingPrice: number;
  stock: number;
  category: string;
  brand: string;
  productCode: string;
}

// this is used for increment and Decrement CArt Quntity
export interface IncrementDecrementCart {
  userId: number;
  productId: number;
  quntity: number;
  previousQuntity: number;
}

export interface PaymentAndOrderDto {
  userId: number;
  cardNumber: string;
  expiryDate: string;
  cvv: number;
  address: string;
  stateName: string;
  countryName: string;
  zipCode: number;
}

export interface PaymentAndOrderResponseDto {
  id: number;
  invoiceId: string;
  invoiceDate: string;
  subTotal: number;
  userId: number;
  deliveryAddress: string;
  deliveryZipCode: number;
  deliveryState: string;
  deliveryCountry: string;
}
