import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../../core/services/CartService/cart.service';
import { Subscription } from 'rxjs';
import {
  CartITemsWithDetails,
  IncrementDecrementCart,
  PaymentAndOrderDto,
  PaymentAndOrderResponseDto,
} from '../../../../core/models/interface/Cart/CartDto.model';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';
import { UserService } from '../../../../core/services/UserService/user.service';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { CommonModule } from '@angular/common';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemsList?: CartITemsWithDetails[];
  loggedUser?: UserDataDto;

  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';

  isLoader: boolean = false;

  private cartService = inject(CartService);
  private userService = inject(UserService);
  private tostR = inject(MyToastServiceService);
  private router = inject(Router);

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

  //For remove item from the cart
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

  //Make the Order
  onClickPayBtn() {
    if (!this.loggedUser) {
      return;
    }
    const [year, month] = this.expiryDate.split('-');
    const formatedExpiryDate = new Date(
      Number(year),
      Number(month) - 1,
      1,
      6,
      7,
      18,
      542
    );

    const isoString = formatedExpiryDate.toISOString();

    console.log(isoString);

    const payload: PaymentAndOrderDto = {
      cardNumber: this.cardNumber.toString(),
      userId: this.loggedUser?.userId,
      cvv: Number(this.cvv),
      expiryDate: isoString,
      address: this.loggedUser.address,
      stateName: this.loggedUser.stateName,
      countryName: this.loggedUser.countryName,
      zipCode: this.loggedUser.zipCode,
    };

    if (payload.cardNumber.length !== 16) {
      this.tostR.showWarning('CartNumber Must be 16 Number');
      return;
    }

    if (!payload.expiryDate) {
      this.tostR.showWarning('Expiry Date is Required');
      return;
    }

    if (payload.cvv.toString().length !== 3) {
      this.tostR.showWarning('CVV Must be 3 Number');
      return;
    }

    this.isLoader = true;
    console.log('Card : ', payload);

    const sub = this.cartService.PaymentAndOrder$(payload).subscribe({
      next: (res: AppResponse<PaymentAndOrderResponseDto>) => {
        if (res.isSuccess) {
          this.isLoader = false;
          this.tostR.showSuccess(res.message);
          this.router.navigate(['org/Customer/Invoice', res.data.id]);
        } else {
          this.isLoader = false;
          this.tostR.showError(res.message);
        }
      },
      error: (err: Error) => {
        console.log('Error to Order : ', err);
        this.isLoader = false;
        this.tostR.showError(err.message);
      },
    });
  }
}
