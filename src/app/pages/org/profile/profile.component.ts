import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserDataDto } from '../../../core/models/classes/User/UserDataDto';
import { Subscription } from 'rxjs';
import { Modal } from 'bootstrap'; // Import Bootstrap Modal
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

  private modalInstance: Modal | null = null; // Hold the modal instance

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
    this.modalInstance = null;
    this.subscriptions.unsubscribe();
  }

  onClickChangePass() {
    if (this.Password === this.ConfirmPassword) {
      if (this.Password.length < 8) {
        this.tostR.showWarning('Password Must be at least 8 characters');
        return;
      }
      if (this.loggedUser) {
        const payload: ChangePasswordDto = {
          userName: this.loggedUser.userName,
          password: this.Password,
          confirmPassword: this.ConfirmPassword,
        };

        const sub = this.userService.ChangePassword$(payload).subscribe({
          next: (res: AppResponse<null>) => {
            if (res.isSuccess) {
              this.closeModal();
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

  // Function to open the modal
  openModal() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement); // Initialize the modal
      this.modalInstance.show(); // Show the modal
    }
  }

  // Function to close the modal
  closeModal() {
    if (this.modalInstance) {
      this.Password = '';
      this.ConfirmPassword = '';
      this.modalInstance.hide(); // Hide the modal
      this.modalInstance = null; // Reset the modal instance
    }
  }
}
