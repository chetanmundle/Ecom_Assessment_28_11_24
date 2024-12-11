import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CustomerOrderForAdminDto,
  InvoiceDto,
  SalesMasterDto,
} from '../../models/interface/Sales/sales.model';
import { AppResponse } from '../../models/interface/AppResponse';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private Url = 'https://localhost:7035/api/Sales';
  private http = inject(HttpClient);
  constructor() {}

  // get invoice by invoice id where in backend there is id column
  GetInvoiceByInvoiceId$(invoId: number): Observable<AppResponse<InvoiceDto>> {
    return this.http.get<AppResponse<InvoiceDto>>(
      `${this.Url}/GetInvoice/${invoId}`
    );
  }

  // Get all orders by UserId
  GetAllOrdersByUserId$(
    userId: number
  ): Observable<AppResponse<SalesMasterDto[]>> {
    return this.http.get<AppResponse<SalesMasterDto[]>>(
      `${this.Url}/GetAllOrdersByUserId/${userId}`
    );
  }

  // Get all customerOrders by adminId
  GetAllCustomerOrderByAdminId$(
    adminId: number
  ): Observable<AppResponse<CustomerOrderForAdminDto[]>> {
    return this.http.get<AppResponse<CustomerOrderForAdminDto[]>>(
      `${this.Url}/GetAllOrdersOfCutomerByAdminId/${adminId}`
    );
  }
}
