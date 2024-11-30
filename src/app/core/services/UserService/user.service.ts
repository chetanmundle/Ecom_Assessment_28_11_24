import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUserDto } from '../../models/interface/User/CreateUserDto';
import { Observable } from 'rxjs';
import { UserWithoutPassDto } from '../../models/interface/User/UserWithoutPass';
import { AppResponse } from '../../models/interface/AppResponse';
import { LoginUserDto } from '../../models/interface/User/LoginUserDto';
import { LoginUSerResponseDto } from '../../models/interface/User/LoginUserResponseDto';
import { LoginUserValidateOtpDto } from '../../models/interface/User/LoginUserValidateOtpDto';
import { ForgetPasswordDto } from '../../models/interface/User/ForgetPasswordDto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private Url = 'https://localhost:7035/api/User';
  private http = inject(HttpClient);

  constructor() {}

  //   Create the New User
  CreateUser(
    userDto: CreateUserDto
  ): Observable<AppResponse<UserWithoutPassDto>> {
    return this.http.post<AppResponse<UserWithoutPassDto>>(
      `${this.Url}/CreateUser`,
      userDto
    );
  }

  // Api for login User
  LoginUser(loginDto: LoginUserDto): Observable<AppResponse<string>> {
    return this.http.post<AppResponse<string>>(
      `${this.Url}/LoginUser`,
      loginDto
    );
  }

  // After sending the otp via login call this api you will get the jwt token
  VerifyOtpAndGetJwtToken(
    payload: LoginUserValidateOtpDto
  ): Observable<AppResponse<LoginUSerResponseDto>> {
    return this.http.post<AppResponse<LoginUSerResponseDto>>(
      `${this.Url}/LoginUserValidateOtp`,
      payload
    );
  }

  // Forget Password 
  ForgetPassword(payload : ForgetPasswordDto):Observable<AppResponse<null>>{
    return this.http.post<AppResponse<null>>(`${this.Url}/ForgetPassword`,payload);
  }
}
