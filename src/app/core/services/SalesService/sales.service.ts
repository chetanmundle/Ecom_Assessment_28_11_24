import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceDto } from '../../models/interface/Sales/sales.model';
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
}
