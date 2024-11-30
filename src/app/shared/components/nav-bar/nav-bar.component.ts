import { Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { UserWithoutPassDto } from '../../../core/models/interface/User/UserWithoutPass';
import { UserService } from '../../../core/services/UserService/user.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnDestroy {
  loggedUser?: UserWithoutPassDto;
  subscriptions: Subscription = new Subscription();

  private userService = inject(UserService);

  constructor(private el: ElementRef) {
    const sub = this.userService.loggedUser$.subscribe({
      next: (user: UserWithoutPassDto) => {
        this.loggedUser = user;
      },
    });

    this.subscriptions.add(sub);
  }

  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
