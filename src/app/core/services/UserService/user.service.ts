import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUserDto } from '../../models/interface/User/CreateUserDto';
import { Observable } from 'rxjs';
import { UserWithoutPassDto } from '../../models/interface/User/UserWithoutPass';
import { AppResponse } from '../../models/interface/AppResponse';

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
}
