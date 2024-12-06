import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SalesService } from '../../../../core/services/SalesService/sales.service';
import { UserService } from '../../../../core/services/UserService/user.service';
import { Subscription } from 'rxjs';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';
import { SalesMasterDto } from '../../../../core/models/interface/Sales/sales.model';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit, OnDestroy {
  loggedUser?: UserDataDto;
  orderList?: SalesMasterDto[];

  private salesService = inject(SalesService);
  private userService = inject(UserService);

  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    const sub = this.userService.loggedUser$.subscribe((res: UserDataDto) => {
      this.loggedUser = res;
      this.getAllOrders();
    });

    this.subscriptions.add(sub);
  }

  // Fuction to get all the order of this user
  getAllOrders() {
    if (this.loggedUser) {
      const sub = this.salesService
        .GetAllOrdersByUserId$(this.loggedUser?.userId)
        .subscribe({
          next: (res: AppResponse<SalesMasterDto[]>) => {
            if (res.isSuccess) {
              this.orderList = res.data;
              console.log('List : ', this.loggedUser?.userId, res);
            }
          },
          error: (err: Error) => {
            console.log('Error to get the Order : ', err);
          },
        });

      this.subscriptions.add(sub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
