export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  userTypeId: number;
  dateOfBirth: string;
  mobile: string;
  address: string;
  zipCode: number;
  profileImage: string;
  stateId: number;
  countryId: number;
}
