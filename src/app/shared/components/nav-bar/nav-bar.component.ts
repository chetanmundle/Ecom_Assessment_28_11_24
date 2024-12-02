import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserWithoutPassDto } from '../../../core/models/interface/User/UserWithoutPass';
import { UserService } from '../../../core/services/UserService/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserDataDto } from '../../../core/models/classes/User/UserDataDto';
import { CartService } from '../../../core/services/CartService/cart.service';
import { CartItems } from '../../../core/models/classes/Cart/Cart.model';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnDestroy, OnInit {
  loggedUser?: UserDataDto;
  subscriptions: Subscription = new Subscription();
  cartItemCount: number = 0;

  private userService = inject(UserService);
  private router = inject(Router);
  private cartService = inject(CartService);

  constructor() {
    // subscribe for which user is currently logged in
    const sub = this.userService.loggedUser$.subscribe({
      next: (user: UserDataDto) => {
        this.loggedUser = user;
      },
    });

    this.subscriptions.add(sub);
  }
  ngOnInit(): void {
    // subscribe to cart Service
    const sub = this.cartService.cartItems$.subscribe({
      next: (cartItem: CartItems[]) => {
        console.log('CartItem', cartItem);

        this.cartItemCount = cartItem.length;
      },
    });

    this.subscriptions.add(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  isModalOpen = false;

  openModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onClickLogOut() {
    localStorage.removeItem('accessToken');
    this.userService.resetLoggedUser();
    this.router.navigateByUrl('/auth/Login');
  }
}
