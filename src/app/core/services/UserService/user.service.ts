import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUserDto } from '../../models/interface/User/CreateUserDto';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserWithoutPassDto } from '../../models/interface/User/UserWithoutPass';
import { AppResponse } from '../../models/interface/AppResponse';
import { LoginUserDto } from '../../models/interface/User/LoginUserDto';
import { LoginUSerResponseDto } from '../../models/interface/User/LoginUserResponseDto';
import { LoginUserValidateOtpDto } from '../../models/interface/User/LoginUserValidateOtpDto';
import { ForgetPasswordDto } from '../../models/interface/User/ForgetPasswordDto';
import { jwtDecode } from 'jwt-decode';
import { UserDataDto } from '../../models/classes/User/UserDataDto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private Url = 'https://localhost:7035/api/User';
  private http = inject(HttpClient);

  // Behaviour Subject for know the who logged in
  loggedUser$: BehaviorSubject<UserDataDto> = new BehaviorSubject<UserDataDto>(
    new UserDataDto()
  );

  constructor() {
    this.getLoggedUser(); // Fetch the user data on service initialization
  }

  private getLoggedUser(): void {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      const userName = decodedToken.userName;

      // Fetch the user details from the API
      this.GetUserByUserName$(userName).subscribe({
        next: (res: AppResponse<UserDataDto>) => {
          if (res.isSuccess) {
            this.loggedUser$.next(res.data); // Update BehaviorSubject with user data
          } else {
            this.loggedUser$.next(new UserDataDto()); // Emit empty user data if the API fails
          }
        },
        error: () => {
          this.loggedUser$.next(new UserDataDto()); // Handle API errors gracefully
        },
      });
    } else {
      this.loggedUser$.next(new UserDataDto()); // Emit empty user data if no token exists
    }
  }

  // This fuction is Used tp reset the Behaviour Subject whhen login is change at that senario or refresh token scenario
  public resetLoggedUser(): void {
    this.getLoggedUser();
  }

  //Get user by UserName
  GetUserByUserName$(userName: string): Observable<AppResponse<UserDataDto>> {
    return this.http.get<AppResponse<UserDataDto>>(
      `${this.Url}/GetUserByUserName/${userName}`
    );
  }

  //   Create the New User
  CreateUser$(
    userDto: CreateUserDto
  ): Observable<AppResponse<UserWithoutPassDto>> {
    return this.http.post<AppResponse<UserWithoutPassDto>>(
      `${this.Url}/CreateUser`,
      userDto
    );
  }

  // Api for login User
  LoginUser$(loginDto: LoginUserDto): Observable<AppResponse<string>> {
    return this.http.post<AppResponse<string>>(
      `${this.Url}/LoginUser`,
      loginDto
    );
  }

  // After sending the otp via login call this api you will get the jwt token
  VerifyOtpAndGetJwtToken$(
    payload: LoginUserValidateOtpDto
  ): Observable<AppResponse<LoginUSerResponseDto>> {
    return this.http.post<AppResponse<LoginUSerResponseDto>>(
      `${this.Url}/LoginUserValidateOtp`,
      payload
    );
  }

  // Forget Password
  ForgetPassword$(payload: ForgetPasswordDto): Observable<AppResponse<null>> {
    return this.http.post<AppResponse<null>>(
      `${this.Url}/ForgetPassword`,
      payload
    );
  }
}
