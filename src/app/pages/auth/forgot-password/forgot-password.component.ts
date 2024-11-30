import { Component, inject, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OtpService } from '../../../core/services/OtpService/otp.service';
import { AppResponse } from '../../../core/models/interface/AppResponse';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { Subscription } from 'rxjs';
import { ForgetPasswordDto } from '../../../core/models/interface/User/ForgetPasswordDto';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { UserService } from '../../../core/services/UserService/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnDestroy {
  StrongPasswordRegx: RegExp =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_=+;:.<>?]).{8,}$/;
  isOtpSend: boolean = false;
  passwordResetForm: FormGroup;
  subscriptions: Subscription = new Subscription();
  isLoader: boolean = false;

  private otpService = inject(OtpService);
  private tostr = inject(MyToastServiceService);
  private userService = inject(UserService);
  private router = inject(Router);

  constructor(private formbuilder: FormBuilder) {
    this.passwordResetForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // this fuction send the otp
  onClickSendOtpBtn() {
    const emailControl = this.passwordResetForm.get('email');
    console.log(emailControl?.value);

    if (emailControl?.invalid) {
      this.tostr.showError('Enter the Valid Email..!');
      return;
    }

    this.isLoader = true;
    const sub = this.otpService.sendOtpToEmail$(emailControl?.value).subscribe({
      next: (res: AppResponse<object>) => {
        if (res.isSuccess) {
          emailControl?.disable();
          this.isOtpSend = true;
          this.isLoader = false;
          this.tostr.showSuccess(res.message);
        } else {
          this.isLoader = false;
          this.tostr.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.isLoader = false;
        this.tostr.showError('Unble to send otp');
      },
    });

    this.subscriptions.add(sub);
  }

  // Change Password fuction
  onClickChangePassword() {
    if (this.passwordResetForm.invalid) {
      this.tostr.showError('Please fill all the fields..!');
      return;
    }

    const payload: ForgetPasswordDto = {
      email: this.passwordResetForm.get('email')?.value,
      otp: Number(this.passwordResetForm.get('otp')?.value),
      password: this.passwordResetForm.get('password')?.value,
      confirmPassword: this.passwordResetForm.get('confirmPassword')?.value,
    };

    const otpLength = payload.otp.toString().length;
    if (otpLength !== 8) {
      this.tostr.showError('Otp Must be 8 Digit');
      return;
    } else if (payload.password !== payload.confirmPassword) {
      this.tostr.showError('Password and Confirm Password Must be Same');
      return;
    }

    this.isLoader = true;

    this.userService.ForgetPassword$(payload).subscribe({
      next: (res: AppResponse<null>) => {
        if (res.isSuccess) {
          this.isLoader = false;
          this.tostr.showSuccess(res.message);
          this.router.navigate(['/auth/Login']);
        } else {
          this.isLoader = false;
          this.tostr.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.isLoader = false;
        this.tostr.showError('Unable to Validate otp');
      },
    });
  }
}
