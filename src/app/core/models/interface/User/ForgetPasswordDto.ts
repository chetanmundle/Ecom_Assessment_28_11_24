export interface ForgetPasswordDto {
  email: string;
  otp: number;
  password: string;
  confirmPassword: string;
}
