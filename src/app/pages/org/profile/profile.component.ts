import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserDataDto } from '../../../core/models/classes/User/UserDataDto';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/UserService/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangePasswordDto } from '../../../core/models/interface/User/ChangePasswordDto.model';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { AppResponse } from '../../../core/models/interface/AppResponse';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  loggedUser?: UserDataDto;

  Password: string = '';
  ConfirmPassword: string = '';

  private tostR = inject(MyToastServiceService);

  subscriptions: Subscription = new Subscription();

  private userService = inject(UserService);

  ngOnInit(): void {
    const sub = this.userService.loggedUser$.subscribe({
      next: (res: UserDataDto) => {
        this.loggedUser = res;
      },
    });

    this.subscriptions.add(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onClickChangePass() {
    if (this.Password === this.ConfirmPassword) {
      if (this.loggedUser) {
        const payload: ChangePasswordDto = {
          userName: this.loggedUser.userName,
          password: this.Password,
          confirmPassword: this.ConfirmPassword,
        };

        const sub = this.userService.ChangePassword$(payload).subscribe({
          next: (res: AppResponse<null>) => {
            if (res.isSuccess) {
              this.tostR.showSuccess('Password changed successfully');
            } else {
              this.tostR.showError(res.message);
            }
          },
          error: (err: Error) => {
            this.tostR.showError(err.message);
          },
        });

        this.subscriptions.add(sub);
      }
    } else {
      this.tostR.showWarning('Passwords do not match');
    }
  }
}
