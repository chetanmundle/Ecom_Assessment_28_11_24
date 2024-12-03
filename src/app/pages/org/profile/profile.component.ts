import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserDataDto } from '../../../core/models/classes/User/UserDataDto';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/UserService/user.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, CommonModule], 
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  loggedUser?: UserDataDto;

  subscriptions: Subscription = new Subscription();

  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.loggedUser$.subscribe({
      next: (res: UserDataDto) => {
        this.loggedUser = res;
      },
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
