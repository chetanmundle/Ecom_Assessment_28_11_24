import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SalesService } from '../../../../core/services/SalesService/sales.service';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { InvoiceDto } from '../../../../core/models/interface/Sales/sales.model';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit, OnDestroy {
  id?: number;
  isLoader: boolean = false;
  invoiceData?: InvoiceDto;

  private salesService = inject(SalesService);

  subscriptions: Subscription = new Subscription();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id') || '');

    this.isLoader = true;

    const sub = this.salesService.GetInvoiceByInvoiceId$(this.id).subscribe({
      next: (res: AppResponse<InvoiceDto>) => {
        if (res.isSuccess) {
          this.invoiceData = res.data;
          this.isLoader = false;
          console.log('Invoice data : ', this.invoiceData);
        } else {
          console.log('Not get invoice Data : ', res);
          this.isLoader = false;
        }
      },
      error: (err: Error) => {
        console.log('Error to get Invoce data : ', err);
        this.isLoader = false;
      },
    });

    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
