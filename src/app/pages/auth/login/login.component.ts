import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { LoginUserDto } from '../../../core/models/interface/User/LoginUserDto';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/UserService/user.service';
import { LoginUSerResponseDto } from '../../../core/models/interface/User/LoginUserResponseDto';
import { AppResponse } from '../../../core/models/interface/AppResponse';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { OtpComponent } from '../../../shared/components/otp/otp.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, OtpComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  showPassword: boolean = false;
  isLoader: boolean = false;
  loginForm: FormGroup;
  isOtpBoxOpen: boolean = false;
  private subscriptions: Subscription = new Subscription();

  private userService = inject(UserService);
  private router = inject(Router);
  private tostr = inject(MyToastServiceService);

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onClickLogIn() {
    this.isLoader = true;
    const payload: LoginUserDto = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    const sub = this.userService.LoginUser$(payload).subscribe({
      next: (res: AppResponse<string>) => {
        if (res.isSuccess) {
          this.isLoader = false;
          this.isOtpBoxOpen = true;
        } else {
          this.isLoader = false;
          console.log('Error to login : ', res);
          this.tostr.showError(res.message);
        }
      },
      error: (error: Error) => {
        this.isLoader = false;
        console.log('Loging Failed : ', error);
        this.tostr.showError(error.message);
      },
    });
    this.subscriptions.add(sub);
  }

  onClickShowPassword() {
    this.showPassword = !this.showPassword;
  }

  getEmail(): string {
    return this.loginForm.get('email')?.value;
  }

  onCancelBtnClick(value: boolean) {
    this.isOtpBoxOpen = value;
  }
}
