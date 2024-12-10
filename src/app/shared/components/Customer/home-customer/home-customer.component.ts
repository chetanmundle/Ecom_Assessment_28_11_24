import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { UserDataDto } from '../../../../core/models/classes/User/UserDataDto';
import { ProductDto } from '../../../../core/models/interface/Product/Product';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ProductService } from '../../../../core/services/ProductService/product.service';
import { AppResponse } from '../../../../core/models/interface/AppResponse';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../core/services/CartService/cart.service';
import { CartItems } from '../../../../core/models/classes/Cart/Cart.model';
import { AddToCartDto } from '../../../../core/models/interface/Cart/CartDto.model';
import { MyToastServiceService } from '../../../../core/services/MyToastService/my-toast-service.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-customer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-customer.component.html',
  styleUrl: './home-customer.component.css',
})
export class HomeCustomerComponent implements OnInit, OnDestroy {
  productList?: ProductDto[];
  @Input() loggedUser?: UserDataDto;

  cartItemsList: CartItems[] = [];

  subscription: Subscription = new Subscription();

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  //   private tostR = inject(MyToastServiceService);
  private tostR = inject(ToastrService);

  ngOnInit(): void {
    // subscribing to searchSubject
    this.productService.searchWordSubjectB$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((word: string) => {
        this.GetAllProduct(word);
      });

    // Get all cartItems
    const sub1 = this.cartService.cartItems$.subscribe({
      next: (res: CartItems[]) => {
        this.cartItemsList = res;
        // console.log("cart data : ",this.cartItemsList);
      },
    });
  }

  // Get Product Method
  GetAllProduct(searchWord: string) {
    const sub = this.productService.GetAllProducts$(searchWord).subscribe({
      next: (res: AppResponse<ProductDto[]>) => {
        if (res.isSuccess) {
          this.productList = res.data;
          //   console.log('Product list : ', this.productList);
        }
      },
      error: (err: Error) => {
        console.log('Unble to get product : ', err);
      },
    });

    this.subscription.add(sub);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //   find the item is added in cart or not
  isExistItem(productId: number): boolean {
    return this.cartItemsList.some((item) => item.productId === productId);
  }

  onClickAddToCart(productId: number, quntity: number) {
    const payload: AddToCartDto = {
      userId: this.loggedUser?.userId || 0,
      productId: productId,
      quntity: quntity,
    };
    if (payload.userId) {
      this.cartService.AddToCart$(payload).subscribe({
        next: (res: AppResponse<null>) => {
          if (res.isSuccess) {
            this.cartService.ResetCart();
            // this.tostR.showSuccess(res.message);
            this.tostR.success(res.message);
          } else {
            console.log('Not added to Cart : ', res.message);
          }
        },
        error: (err) => {
          console.log('Unble to add to cart ', err);
        },
      });
    }
  }
}
