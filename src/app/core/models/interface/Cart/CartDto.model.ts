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
