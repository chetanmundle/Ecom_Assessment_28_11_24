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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Modal } from 'bootstrap';
import { DeliveryAddress } from '../../../../core/models/interface/User/Addres.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItemsList?: CartITemsWithDetails[];
  loggedUser?: UserDataDto;
  cardDetailsForm: FormGroup;

  deliveryAddressForm: FormGroup;
  address?: string;
  zipCode?: number;

  isLoader: boolean = false;

  private cartService = inject(CartService);
  private userService = inject(UserService);
  private tostR = inject(MyToastServiceService);
  private router = inject(Router);
  private modalInstance: Modal | null = null; // Hold the modal instance
  private addressmodalInstance: Modal | null = null; // Hold the Address modal instance

  subscriptions: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) {
    this.cardDetailsForm = this.formBuilder.group({
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
    });

    // Assign the delivery address form
    this.deliveryAddressForm = formBuilder.group({
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // subscribe for which user is currently logged in

    // this.cartService.ResetCart();
    const sub = this.userService.loggedUser$.subscribe({
      next: (user: UserDataDto) => {
        this.loggedUser = user;
        this.deliveryAddressForm
          .get('address')
          ?.setValue(this.loggedUser.address);
        this.deliveryAddressForm
          .get('zipCode')
          ?.setValue(this.loggedUser.zipCode);
        this.GetCartDataWithDetails();

        //for variable
        this.address = this.loggedUser.address;
        this.zipCode = Number(this.loggedUser.zipCode);
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

    if (this.cartItemsList?.length === 0) {
      this.tostR.showWarning('Your cart is empty');
      return;
    }
    if (
      this.cardDetailsForm.get('cardNumber')?.value.toString().length !== 16
    ) {
      this.tostR.showWarning('CartNumber Must be 16 Number');
      return;
    }

    if (!this.cardDetailsForm.get('expiryDate')?.value.length) {
      this.tostR.showWarning('Expiry Date is Required');
      return;
    }

    if (this.cardDetailsForm.get('cvv')?.value.toString().length != 3) {
      this.tostR.showWarning('CVV Must be 3 Number');
      return;
    }

    const [year, month] = this.cardDetailsForm
      .get('expiryDate')
      ?.value.split('-');
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
      cardNumber: this.cardDetailsForm.get('cardNumber')?.value.toString(),
      userId: this.loggedUser?.userId,
      cvv: Number(this.cardDetailsForm.get('cvv')?.value),
      expiryDate: isoString,
      address: this.address || this.loggedUser.address,
      stateName: this.loggedUser.stateName,
      countryName: this.loggedUser.countryName,
      zipCode: Number(this.zipCode) || this.loggedUser.zipCode,
    };

    this.isLoader = true;

    const sub = this.cartService.PaymentAndOrder$(payload).subscribe({
      next: (res: AppResponse<PaymentAndOrderResponseDto>) => {
        if (res.isSuccess) {
          this.isLoader = false;
          this.closeModal();
          this.tostR.showSuccess(res.message);
          this.cartService.ResetCart();
          this.router.navigate(['org/Customer/Invoice', res.data.id]);
        } else {
          this.isLoader = false;
          this.tostR.showError(res.message);
        }
      },
      error: (err: Error) => {
        console.log('Error to Order : ', err);
        this.isLoader = false;
        this.tostR.showError('Server Error...!');
      },
    });
  }

  // Function to open the modal CArdModal
  openModal() {
    if (this.cartItemsList?.length === 0) {
      this.tostR.showWarning('Your cart is empty');
      return;
    }
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement); // Initialize the modal
      this.modalInstance.show(); // Show the modal
    }
  }

  // Function to close the modal Card Modal
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide(); // Hide the modal
      this.modalInstance = null; // Reset the modal instance
    }
  }

  openAddressModal() {
    const modalElement = document.getElementById('addressModal');
    if (modalElement) {
      this.addressmodalInstance = new Modal(modalElement); // Initialize the modal
      this.addressmodalInstance.show(); // Show the modal
    }
  }

  // Function to close the modal Card Modal
  closeAddressModal() {
    if (this.addressmodalInstance) {
      this.addressmodalInstance.hide(); // Hide the modal
      this.addressmodalInstance = null; // Reset the modal instance
    }
  }

  onClickSaveAddress() {
    this.address = this.deliveryAddressForm.get('address')?.value;
    this.zipCode = Number(this.deliveryAddressForm.get('zipCode')?.value);
    this.closeAddressModal();
  }

  onCardNumberInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    event.target.value = value;
    this.cardDetailsForm.controls['cardNumber'].setValue(value);
  }

  onCardCvvInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');

    if (value.length > 3) {
      value = value.slice(0, 3);
    }
    event.target.value = value;
    this.cardDetailsForm.controls['cvv'].setValue(value);
  }
}
