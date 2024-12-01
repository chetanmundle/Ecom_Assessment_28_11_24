import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserDataDto } from '../../../core/models/classes/User/UserDataDto';
import { UserService } from '../../../core/services/UserService/user.service';
import { HomeAdminComponent } from '../../../shared/components/Admin/home-admin/home-admin.component';
import { HomeCustomerComponent } from '../../../shared/components/Customer/home-customer/home-customer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeAdminComponent, HomeCustomerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnDestroy {
  loggedUser?: UserDataDto;
  subscriptions: Subscription = new Subscription();

  private userService = inject(UserService);

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
}
