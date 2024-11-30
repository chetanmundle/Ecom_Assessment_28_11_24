import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginUserValidateOtpDto } from '../../../core/models/interface/User/LoginUserValidateOtpDto';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { UserService } from '../../../core/services/UserService/user.service';
import { AppResponse } from '../../../core/models/interface/AppResponse';
import { LoginUSerResponseDto } from '../../../core/models/interface/User/LoginUserResponseDto';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css',
})
export class OtpComponent implements OnDestroy {
  @Input() email: string = '';
  @Output() onCancelBtnClick = new EventEmitter<boolean>();
  otp: string[] = ['', '', '', '', '', ''];
  subscriptions: Subscription = new Subscription();

  private tostr = inject(MyToastServiceService);
  private userService = inject(UserService);
  private router = inject(Router);

  onClickCancel() {
    this.onCancelBtnClick.emit(false);
  }

  onInput(event: any, index: number) {
    const inputElement = event.target;
    const nextInput =
      document.querySelectorAll<HTMLInputElement>('#otp > input')[index + 1];
    const prevInput =
      document.querySelectorAll<HTMLInputElement>('#otp > input')[index - 1];

    // Allow only one character
    if (inputElement.value.length > 1) {
      inputElement.value = inputElement.value[0];
    }

    // Focus next field if valid input
    if (inputElement.value && nextInput) {
      nextInput.focus();
    }

    // Handle backspace
    if (event.inputType === 'deleteContentBackward' && prevInput) {
      prevInput.focus();
    }
  }

  validateOTP() {
    const otpCode = this.otp.join('');

    if (!otpCode || otpCode.length !== 6) {
      this.tostr.showWarning('Enter the Correct Otp');
      return;
    }
    const payload: LoginUserValidateOtpDto = {
      email: this.email,
      otpValue: Number(otpCode),
    };

    const sub = this.userService.VerifyOtpAndGetJwtToken$(payload).subscribe({
      next: (res: AppResponse<LoginUSerResponseDto>) => {
        if (res.isSuccess) {
          localStorage.setItem('accessToken', res.data.accessToken);
          this.userService.resetLoggedUser();
          this.router.navigate(['/org/Home']);
          this.tostr.showSuccess(res.message);
        } else {
          this.tostr.showError(res.message);
        }
      },
      error: (err: Error) => {
        this.tostr.showError(err.message);
        console.log('Error to varify otp : ', err);
      },
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
