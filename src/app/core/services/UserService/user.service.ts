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
    this.getLoggedUser()
  );

  // this fuction decode the token and set in BehaviorSubject
  private getLoggedUser(): UserDataDto {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const decodedToken: any = jwtDecode(accessToken);
      const userName = decodedToken.userName;
      let userDataDto = new UserDataDto();
      this.GetUserByUserName$(userName).subscribe({
        next: (res: AppResponse<UserDataDto>) => {
          if (res.isSuccess) {
            userDataDto.userId = res.data.userId;
            userDataDto.firstName = res.data.firstName;
            userDataDto.lastName = res.data.lastName;
            userDataDto.userName = res.data.userName;
            userDataDto.email = res.data.email;
            userDataDto.userTypeName = res.data.userTypeName;
            userDataDto.dateOfBirth = res.data.dateOfBirth;
            userDataDto.mobile = res.data.mobile;
            userDataDto.address = res.data.address;
            userDataDto.zipCode = res.data.zipCode;
            userDataDto.profileImage = res.data.profileImage;
          }
        },
      });
      return userDataDto;
    }
    return new UserDataDto();
  }

  // This fuction is Used tp reset the Behaviour Subject whhen login is change at that senario or refresh token scenario
  public resetLoggedUser(): void {
    const newLoggedUser = this.getLoggedUser();
    this.loggedUser$.next(newLoggedUser);
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
