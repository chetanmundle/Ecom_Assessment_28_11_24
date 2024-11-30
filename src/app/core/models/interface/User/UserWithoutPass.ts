// export interface UserWithoutPassDto {
//   UserId: number;
//   FirstName: string;
//   LastName: string;
//   UserName: string;
//   Email: string;
//   UserTypeId: number;
//   DateOfBirth: string;
//   Mobile: string;
//   Address: string;
//   ZipCode: number;
//   ProfileImage: string;
//   StateId: number;
//   CountryId: number;
// }

export class UserWithoutPassDto {
  userId: number = 0;
  firstName: string = '';
  lastName: string = '';
  userName: string = '';
  email: string = '';
  userTypeId: number = 0;
  dateOfBirth: string = '';
  mobile: string = '';
  address: string = '';
  zipCode: number = 0;
  profileImage: string = '';
  stateId: number = 0;
  countryId: number = 0;
}
