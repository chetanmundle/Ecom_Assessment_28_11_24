import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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

  searchWordSubjectB$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );

  // Emit data in SearchWordSubjectB$
  EmitDataInSearchordSubjectB(searchWord: string) {
    this.searchWordSubjectB$.next(searchWord);
  }

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
  GetAllProducts$(searchWord: string): Observable<AppResponse<ProductDto[]>> {
    return this.http.get<AppResponse<ProductDto[]>>(
      `${this.Url}/GetAllProducts/${searchWord}`
    );
  }
}
