import { Component, inject, OnDestroy } from '@angular/core';
import { UserWithoutPassDto } from '../../../core/models/interface/User/UserWithoutPass';
import { UserService } from '../../../core/services/UserService/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserDataDto } from '../../../core/models/classes/User/UserDataDto';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnDestroy {
  loggedUser?: UserDataDto;
  subscriptions: Subscription = new Subscription();

  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {
    // subscribe for which user is currently logged in
    const sub = this.userService.loggedUser$.subscribe({
      next: (user: UserDataDto) => {
        this.loggedUser = user;
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
