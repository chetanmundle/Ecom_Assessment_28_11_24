export class UserDataDto {
  userId: number = 1;
  firstName: string = '';
  lastName: string = '';
  userName: string = '';
  email: string = '';
  userTypeName: string = '';
  dateOfBirth: string = '';
  mobile: string = '';
  address: string = '';
  zipCode: number = 0;
  profileImage: string = '';
  countryName: string = '';
  stateName: string = '';
}

export interface UpdateUserDto {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  mobile: string;
  address: string;
  profileImage: string;
}
