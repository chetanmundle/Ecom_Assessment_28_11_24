import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItems } from '../../models/classes/Cart/Cart.model';
import { jwtDecode } from 'jwt-decode';
import { AppResponse } from '../../models/interface/AppResponse';
import { HttpClient } from '@angular/common/http';
import {
  AddToCartDto,
  CartITemsWithDetails,
  IncrementDecrementCart,
} from '../../models/interface/Cart/CartDto.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private Url = 'https://localhost:7035/api/Cart';
  cartItems$: BehaviorSubject<CartItems[]> = new BehaviorSubject<CartItems[]>(
    []
  );

  constructor() {
    this.setBehaviourGetCartItems();
  }

  // Get all Cart Items
  private setBehaviourGetCartItems(): void {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      const userId = decodedToken.userId;

      this.GetCartItems$(userId).subscribe({
        next: (res: AppResponse<CartItems[]>) => {
          if (res.isSuccess) {
            this.cartItems$.next(res.data);
            // console.log('Service res: ', res);
            // console.log('Service d : ', res.data);
          } else {
            this.cartItems$.next([]);
          }
        },
        error: (err) => {
          this.cartItems$.next([]);
        },
      });
    } else {
      this.cartItems$.next([]);
    }
  }

  // Get all items in cart
  GetCartItems$(userId: number): Observable<AppResponse<CartItems[]>> {
    return this.http.get<AppResponse<CartItems[]>>(
      `${this.Url}/GetAllCartItemByUserId/${userId}`
    );
  }

  // Reset the cart
  ResetCart() {
    this.setBehaviourGetCartItems();
  }

  // Add to Cart
  AddToCart$(data: AddToCartDto): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(`${this.Url}/AddToCart`, data);
  }

  // Get all carItems with Details
  GetAllCartItemsWithDetails$(
    userId: number
  ): Observable<AppResponse<CartITemsWithDetails[]>> {
    return this.http.get<AppResponse<CartITemsWithDetails[]>>(
      `${this.Url}/GetAllCartItemWithDetailsByUserId/${userId}`
    );
  }

  // Increment Cart Service
  IncrementCartQuntity$(
    payload: IncrementDecrementCart
  ): Observable<AppResponse<null>> {
    return this.http.put<AppResponse<null>>(
      `${this.Url}/IncrementItemInCart`,
      payload
    );
  }

  // Decrement Cart Service
  DecrementCartQuntity$(
    payload: IncrementDecrementCart
  ): Observable<AppResponse<null>> {
    return this.http.put<AppResponse<null>>(
      `${this.Url}/DecrementItemInCart`,
      payload
    );
  }

  // Remove Item From Cart Service
  RemoveItemFromCart$(cartDetailsId: number): Observable<AppResponse<null>> {
    return this.http.delete<AppResponse<null>>(
      `${this.Url}/RemoveItemFromCart/${cartDetailsId}`
    );
  }
}
