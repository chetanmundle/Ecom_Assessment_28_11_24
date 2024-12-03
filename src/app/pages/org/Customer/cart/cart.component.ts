import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/CartService/cart.service';
import { Subscription } from 'rxjs';
import {
  CartITemsWithDetails,
  IncrementDecrementCart,
} from '../../../../core/models/interface/Cart/CartDto.model';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';
import { UserService } from '../../../../core/services/UserService/user.service';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { CommonModule } from '@angular/common';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemsList?: CartITemsWithDetails[];
  loggedUser?: UserDataDto;

  expiryDate: string = '';
  isValid: boolean = true;

  private cartService = inject(CartService);
  private userService = inject(UserService);
  private tostR = inject(MyToastServiceService);

  subscriptions: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    // subscribe for which user is currently logged in

    // this.cartService.ResetCart();

    const sub = this.userService.loggedUser$.subscribe({
      next: (user: UserDataDto) => {
        this.loggedUser = user;
        // console.log('logged user', this.loggedUser);
        this.GetCartDataWithDetails();
      },
    });

    this.subscriptions.add(sub);
  }

  // get all cart items with details
  GetCartDataWithDetails() {
    if (this.loggedUser?.userId) {
      // get all data of cart with details
      this.cartService
        .GetAllCartItemsWithDetails$(this.loggedUser?.userId)
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

  // Get subtotal of all items of cart
  getSubTotal(): number {
    if (this.cartItemsList) {
      return this.cartItemsList.reduce((total, item) => {
        return total + item.sellingPrice * item.quntity;
      }, 0);
    }

    return 0;
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onClickDecrement(cartItem: CartITemsWithDetails) {
    if (this.loggedUser) {
      const payload: IncrementDecrementCart = {
        userId: this.loggedUser?.userId,
        productId: cartItem.productId,
        previousQuntity: cartItem.quntity,
        quntity: 1,
      };
      console.log('Pauy : ', payload);

      const sub = this.cartService.DecrementCartQuntity$(payload).subscribe({
        next: (res: AppResponse<null>) => {
          if (res.isSuccess) {
            this.cartService.ResetCart();
            this.GetCartDataWithDetails();
          } else {
            this.tostR.showError(res.message);
          }
        },
        error: (err: Error) => {
          console.log('Error to increment : ', err);
        },
      });
      this.subscriptions.add(sub);
    }
  }

  onClickIncrement(cartItem: CartITemsWithDetails) {
    if (this.loggedUser) {
      const payload: IncrementDecrementCart = {
        userId: this.loggedUser?.userId,
        productId: cartItem.productId,
        previousQuntity: cartItem.quntity,
        quntity: 1,
      };
      const sub = this.cartService.IncrementCartQuntity$(payload).subscribe({
        next: (res: AppResponse<null>) => {
          console.log('res I : ', res);

          if (res.isSuccess) {
            this.cartService.ResetCart();
            this.GetCartDataWithDetails();
          } else {
            this.tostR.showError(res.message);
          }
        },
        error: (err: Error) => {
          console.log('Error to increment : ', err);
        },
      });

      this.subscriptions.add(sub);
    }
  }

  onClickRemoveFromCart(cartDetailsId: number) {
    const sub = this.cartService.RemoveItemFromCart$(cartDetailsId).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          this.tostR.showSuccess(res.message);
          this.cartService.ResetCart();
          this.GetCartDataWithDetails();
        } else {
          console.log('unble to delte cartItem : ', res.message);
        }
      },
      error: (err: Error) => {
        console.log('Error to delete cart Item : ', err);
      },
    });
    this.subscriptions.add(sub);
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value;
    
    // Remove non-numeric characters
    value = value.replace(/\D/g, '');

    // Insert '/' between MM and YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    // Update the input value with the formatted value
    this.expiryDate = value;
  }

  // Method to check if the date is valid
  isValidDate(date: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    return regex.test(date);
  }
}
