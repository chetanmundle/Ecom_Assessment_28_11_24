import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/CartService/cart.service';
import { Subscription } from 'rxjs';
import { CartITemsWithDetails } from '../../../../core/models/interface/Cart/CartDto.model';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';
import { UserService } from '../../../../core/services/UserService/user.service';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemsList?: CartITemsWithDetails[];
  loggedUser?: UserDataDto;

  private cartService = inject(CartService);

  subscriptions: Subscription = new Subscription();

  private userService = inject(UserService);

  constructor() {}

  ngOnInit(): void {
    // subscribe for which user is currently logged in

    const sub = this.userService.loggedUser$.subscribe({
      next: (user: UserDataDto) => {
        this.loggedUser = user;
        // console.log('logged user', this.loggedUser);
        this.GetCartDataWithDetails();
      },
    });

    this.subscriptions.add(sub);
  }

  GetCartDataWithDetails() {
    if (this.loggedUser?.userId) {
      // get all data of cart with details
      this.cartService
        .GetAllCartItemsWithDetails(this.loggedUser?.userId)
        .subscribe({
          next: (res: AppResponse<CartITemsWithDetails[]>) => {
            if (res.isSuccess) {
              this.cartItemsList = res.data;
            }
          },
          error: (err) =>
            console.error('Error to get Data of CartDetails', err),
        });
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
