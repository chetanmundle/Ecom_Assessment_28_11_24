export interface ProductDto {
  productId: number;
  productName: string;
  productCode: string;
  productImage: string;
  category: string;
  brand: string;
  sellingPrice: number;
  purchasePrice: number;
  purchaseDate: string;
  stock: number;
  createdBy: number;
  isDeleted: boolean;
}

export interface CreateProductDto {
  productName: string;
  productImage: string;
  category: string;
  brand: string;
  sellingPrice: number;
  purchasePrice: number;
  purchaseDate: string;
  stock: number;
  createdBy: number;
}

// use for update
export interface UpdateProductDto {
  productId: number;
  productName: string;
  productImage: string;
  category: string;
  brand: string;
  sellingPrice: number;
  purchasePrice: number;
  purchaseDate: string;
  stock: number;
}
