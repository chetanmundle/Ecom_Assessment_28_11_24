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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private Url = 'https://localhost:7035/api/User';
  private http = inject(HttpClient);

  // bSubject for know the who logged in
  loggedUser$: BehaviorSubject<UserWithoutPassDto> =
    new BehaviorSubject<UserWithoutPassDto>(this.getLoggedUser());

  // this fuction decode the token and set in BehaviorSubject
  private getLoggedUser(): UserWithoutPassDto {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      const userName = decodedToken.userName;
      let userWithoutPassDto = new UserWithoutPassDto();
      this.GetUserByUserName$(userName).subscribe({
        next: (res: AppResponse<UserWithoutPassDto>) => {
          if (res.isSuccess) {
            userWithoutPassDto.userId = res.data.userId;
            userWithoutPassDto.firstName = res.data.firstName;
            userWithoutPassDto.lastName = res.data.lastName;
            userWithoutPassDto.userName = res.data.userName;
            userWithoutPassDto.email = res.data.email;
            userWithoutPassDto.userTypeId = res.data.userTypeId;
            userWithoutPassDto.dateOfBirth = res.data.dateOfBirth;
            userWithoutPassDto.mobile = res.data.mobile;
            userWithoutPassDto.address = res.data.address;
            userWithoutPassDto.zipCode = res.data.zipCode;
            userWithoutPassDto.profileImage = res.data.profileImage;
            userWithoutPassDto.stateId = res.data.stateId;
            userWithoutPassDto.countryId = res.data.countryId;
          }
        },
      });
      return userWithoutPassDto;
    }
    return new UserWithoutPassDto();
  }

  // This fuction is Used tp reset the Behaviour Subject whhen login is change at that senario or refresh token scenario
  public resetLoggedUser(): void {
    const newLoggedUser = this.getLoggedUser();
    this.loggedUser$.next(newLoggedUser);
  }

  //Get user by UserName
  GetUserByUserName$(
    userName: string
  ): Observable<AppResponse<UserWithoutPassDto>> {
    return this.http.get<AppResponse<UserWithoutPassDto>>(
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
