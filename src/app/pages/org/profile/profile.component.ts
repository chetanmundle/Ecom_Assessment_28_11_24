import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  UpdateUserDto,
  UserDataDto,
} from '../../../core/models/classes/User/UserDataDto';
import { Subscription } from 'rxjs';
import { Modal } from 'bootstrap'; // Import Bootstrap Modal
import { UserService } from '../../../core/services/UserService/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangePasswordDto } from '../../../core/models/interface/User/ChangePasswordDto.model';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { AppResponse } from '../../../core/models/interface/AppResponse';
import { ImageService } from '../../../core/services/ImageService/image.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  loggedUser?: UserDataDto;
  isEditMode: boolean = false;
  userForm: FormGroup;
  selectedFile: File | null = null;
  isLoader: boolean = false;
  isMobileNumberValid: boolean = false;

  private modalInstance: Modal | null = null; // Hold the modal instance

  Password: string = '';
  ConfirmPassword: string = '';

  private tostR = inject(MyToastServiceService);
  private imageService = inject(ImageService);
  subscriptions: Subscription = new Subscription();

  private userService = inject(UserService);

  constructor(private builder: FormBuilder) {
    this.userForm = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      profileImage: ['', Validators.required],
    });
  }

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
            this.tostR.showError('Server Error...!');
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
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  // Function to close the modal
  closeModal() {
    if (this.modalInstance) {
      this.Password = '';
      this.ConfirmPassword = '';
      this.modalInstance.hide();
      this.modalInstance = null; // Reset the modal instance
    }
  }

  onClickEdit() {
    this.isEditMode = true;
    if (this.loggedUser) {
      this.userForm.get('firstName')?.setValue(this.loggedUser.firstName);
      this.userForm.get('lastName')?.setValue(this.loggedUser.lastName);
      this.userForm.get('email')?.setValue(this.loggedUser.email);
      this.userForm
        .get('dateOfBirth')
        ?.setValue(this.loggedUser.dateOfBirth.toString().split('T')[0]);
      this.userForm.get('mobile')?.setValue(this.loggedUser.mobile);
      this.userForm.get('address')?.setValue(this.loggedUser.address);
      this.userForm.get('profileImage')?.setValue(this.loggedUser.profileImage);
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // call when click on update nad save the image
  onClickUpdate() {
    if (this.userForm.invalid) {
      return;
    }
    this.isLoader = true;
    if (this.selectedFile) {
      const sub = this.imageService.uploadImage$(this.selectedFile).subscribe({
        next: (res: AppResponse<string>) => {
          if (res.isSuccess) {
            this.userForm.get('profileImage')?.setValue(res.data);
            this.updateProfile();
          } else {
            this.tostR.showWarning(res.message);
            this.isLoader = false;
            console.log('Unble to Save the Profile Image : ', res.message);
          }
        },
        error: (err: Error) => {
          this.isLoader = false;
          console.log('Unble to Save the Image', err.message);
        },
      });

      this.subscriptions.add(sub);
    } else {
      this.updateProfile();
    }
  }

  // SAve the data
  updateProfile() {
    if (!this.loggedUser) {
      this.tostR.showWarning('Please login Again');
      return;
    }
    this.isLoader = true;
    const payload: UpdateUserDto = {
      userId: this.loggedUser?.userId,
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      address: this.userForm.get('address')?.value,
      dateOfBirth: this.userForm.get('dateOfBirth')?.value,
      email: this.userForm.get('email')?.value,
      mobile: this.userForm.get('mobile')?.value,
      profileImage: this.userForm.get('profileImage')?.value,
    };

    const sub = this.userService.UpdateUser$(payload).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          this.userService.resetLoggedUser();
          this.isLoader = false;
          this.isEditMode = false;
          this.tostR.showSuccess(res.message);
        } else {
          this.isLoader = false;
          this.tostR.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.isLoader = false;
        this.tostR.showError('Internal Server error');
      },
    });

    this.subscriptions.add(sub);
  }

  onClickCancelEditMode() {
    this.isEditMode = false;
  }

  todaysDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // Returns the date in YYYY-MM-DD format
  }

  onNumberType(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    event.target.value = value;

    if (value.length == 10) {
      this.isMobileNumberValid = true;
    } else {
      this.isMobileNumberValid = false;
    }

    this.userForm.controls['mobile'].setValue(value);
  }

  // Handle not accept more that 25 letters
  onInputText(event: any): void {
    const input = event.target;
    if (input.value.length > 25) {
      input.value = input.value.slice(0, 25);
      this.userForm.controls[input.getAttribute('formControlName')].setValue(
        input.value
      );
    }
  }
}
