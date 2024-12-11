import { Component, OnDestroy, OnInit } from '@angular/core';
import { SalesService } from '../../../../core/services/SalesService/sales.service';
import { Subscription } from 'rxjs';
import { CustomerOrderForAdminDto } from '../../../../core/models/interface/Sales/sales.model';
import { UserService } from '../../../../core/services/UserService/user.service';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css',
})
export class CustomerOrdersComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  customerOrdersList?: CustomerOrderForAdminDto[];
  loggedUser?: UserDataDto;

  constructor(
    private salesService: SalesService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const sub = this.userService.loggedUser$.subscribe((res: UserDataDto) => {
      console.log('Api sub');

      this.loggedUser = res;
      this.GetAllCustomersOrderByAdminId(this.loggedUser.userId);
    });

    this.subscriptions.add(sub);
  }

  // this method will fetch the all the orders of admin which is order by customers
  GetAllCustomersOrderByAdminId(adminId: number) {
    const sub = this.salesService
      .GetAllCustomerOrderByAdminId$(adminId)
      .subscribe({
        next: (res: AppResponse<CustomerOrderForAdminDto[]>) => {
          if (res.isSuccess) {
            this.customerOrdersList = res.data;
            console.log('Customer orders : ', this.customerOrdersList);
          } else {
            console.log('Unble to get Data : ', res);
          }
        },
        error: (err: Error) => {
          console.log('Error to get the Data : ', err);
        },
      });

    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
