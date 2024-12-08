import { Component, inject, OnDestroy } from '@angular/core';
import { ImageService } from '../../../core/services/ImageService/image.service';
import { CommonModule } from '@angular/common';

import { AppResponse } from '../../../core/models/interface/AppResponse';
import { Subscription } from 'rxjs';
import { CountryStateService } from '../../../core/services/CountryCityService/country-state.service';
import { CountryDto } from '../../../core/models/interface/countryState/CountryDto';
import { StateDto } from '../../../core/models/interface/countryState/StateDto';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateUserDto } from '../../../core/models/interface/User/CreateUserDto';
import { UserService } from '../../../core/services/UserService/user.service';
import { UserWithoutPassDto } from '../../../core/models/interface/User/UserWithoutPass';
import { MyToastServiceService } from '../../../core/services/MyToastService/my-toast-service.service';
import { Router, RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnDestroy {
  selectedFile: File | null = null;
  countryList?: CountryDto[];
  stateList?: StateDto[];
  selectedCountryId?: number;
  private subscriptions: Subscription = new Subscription();
  userForm: FormGroup;
  isLoader: boolean = false;
  isSubmitClick: boolean = false;
  isMobileNumberValid: boolean = false;

  private countryStateService = inject(CountryStateService);
  private userService = inject(UserService);
  private tostrService = inject(MyToastServiceService);
  private router = inject(Router);

  constructor(
    private imageService: ImageService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userTypeId: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      profileImage: [''],
      stateId: ['', Validators.required],
      countryId: ['', Validators.required],
      isChecked: [true, [Validators.requiredTrue]],
    });
    // subscribe for getting countries
    const sub = this.countryStateService.GetAllCountries$().subscribe({
      next: (res: AppResponse<CountryDto[]>) => {
        if (res.isSuccess) {
          this.countryList = res.data;
          return;
        } else {
          console.log('Unble to get Countries ', res);
        }
      },
      error: (error: Error) => {
        console.log('Error to register', error);
      },
    });

    this.subscriptions.add(sub);
  }

  // Clear form
  onClickClearBtn() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      userTypeId: ['', [Validators.required]],
      dateOfBirth: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      profileImage: [''],
      stateId: ['', Validators.required],
      countryId: ['', Validators.required],
      isChecked: [true, [Validators.requiredTrue]],
    });

    this.selectedFile = null;
  }

  // Unsubscribe all services which are subscribed
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  todaysDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month}-${day}`; // Returns the date in YYYY-MM-DD format
  }

  // function will call only when the country will change
  onChangeCountry(event: Event) {
    this.userForm.get('stateId')?.setValue('');
    const selectElement = event.target as HTMLSelectElement;
    const countryId = Number(selectElement.value);

    const sub = this.countryStateService
      .GetAllStateByCountryId$(countryId)
      .subscribe({
        next: (res: AppResponse<StateDto[]>) => {
          if (res.isSuccess) {
            this.stateList = res.data;
            return;
          } else {
            console.log('Unble to get the state : ', res);
          }
        },
        error: (err: Error) => {
          console.log('Error to get the States : ', err);
        },
      });

    this.subscriptions.add(sub);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // this fuction call whern user click on Register btn
  onClickRegitster() {
    this.isSubmitClick = true;
    if (this.userForm.invalid) {
      return;
    }
    const mobilenumber = this.userForm.get('mobile')?.value.toString();
    if (mobilenumber.length != 10) {
      this.tostrService.showError('Mobile Number Should have 10 Number');
      return;
    }

    this.isLoader = true;
    if (this.selectedFile) {
      const sub = this.imageService.uploadImage$(this.selectedFile).subscribe({
        next: (res: AppResponse<string>) => {
          if (res.isSuccess) {
            this.userForm.get('profileImage')?.setValue(res.data);
            this.RegisterUser();
          } else {
            this.tostrService.showWarning(res.message);
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
      this.RegisterUser();
    }
  }

  // this fuction called After image store
  RegisterUser() {
    this.isLoader = true;

    const payload: CreateUserDto = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      email: this.userForm.get('email')?.value,
      userTypeId: Number(this.userForm.get('userTypeId')?.value),
      dateOfBirth: this.userForm.get('dateOfBirth')?.value,
      mobile: this.userForm.get('mobile')?.value.toString(),
      address: this.userForm.get('address')?.value,
      zipCode: Number(this.userForm.get('zipCode')?.value),
      profileImage: this.userForm.get('profileImage')?.value,
      stateId: Number(this.userForm.get('stateId')?.value),
      countryId: Number(this.userForm.get('countryId')?.value),
    };

    const sub = this.userService.CreateUser$(payload).subscribe({
      next: (res: AppResponse<UserWithoutPassDto>) => {
        if (res.isSuccess) {
          this.tostrService.showSuccess(res.message);
          this.router.navigateByUrl('/auth/Login');
          this.isLoader = false;
          return;
        }
        this.isLoader = false;
        this.tostrService.showError(res.message);
      },
      error: (err: Error) => {
        this.isLoader = false;
        console.log('Error to register : ', err);

        this.tostrService.showError('Server Error...!');
      },
    });

    this.subscriptions.add(sub);
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

  onZipCodeChange(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    event.target.value = value;

    this.userForm.controls['zipCode'].setValue(value);
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
