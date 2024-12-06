export interface InvoiceDto {
  invoId: number;
  invoiceId: string;
  name: string;
  phone: string;
  address: string;
  stateName: string;
  countryName: string;
  zipCode: number;
  invoiceDate: string;
  subTotal: number;
  salesDetailofInvoce: SalesDetailofInvoce[];
}

export interface SalesDetailofInvoce {
  salesDetailsId: number;
  productId: number;
  productCode: string;
  productName: string;
  productBrand: string;
  saleQuntity: number;
  sellingPrice: number;
}

export interface SalesMasterDto {
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
