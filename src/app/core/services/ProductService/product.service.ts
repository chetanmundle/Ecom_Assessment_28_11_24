import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../../models/interface/AppResponse';
import {
  CreateProductDto,
  ProductDto,
  UpdateProductDto,
} from '../../models/interface/Product/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private Url = 'https://localhost:7035/api/Product';
  private http = inject(HttpClient);

  // Get all product by User Id
  GetProductByUserId$(userId: number): Observable<AppResponse<ProductDto[]>> {
    return this.http.get<AppResponse<ProductDto[]>>(
      `${this.Url}/GetProcutByUserId/${userId}`
    );
  }

  // Service for create new Product
  CreateProduct$(createUser: CreateProductDto): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/CreateProduct`,
      createUser
    );
  }

  // Delete the product by ProductId
  DeleteProductById$(productId: number): Observable<AppResponse<null>> {
    return this.http.delete<AppResponse<null>>(
      `${this.Url}/DeleteProductById/${productId}`
    );
  }

  //Update product
  UpdateProduct$(
    updateProduct: UpdateProductDto
  ): Observable<AppResponse<null>> {
    return this.http.put<AppResponse<null>>(
      `${this.Url}/UpdateProduct`,
      updateProduct
    );
  }

  // Get all products
  GetAllProducts$(): Observable<AppResponse<ProductDto[]>> {
    return this.http.get<AppResponse<ProductDto[]>>(`${this.Url}/GetAllProducts`);
  }
}
