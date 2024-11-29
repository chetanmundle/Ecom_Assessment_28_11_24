using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Users;
using Dapper;
using System;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IEncryptionService _encryptionService;
        private readonly IAppDbContext _appDbContext;
        private readonly IEmailService _emailService;

        public UserRepository(IEncryptionService encryptionService,
            IAppDbContext appDbContext, IEmailService emailService)
        {
            _encryptionService = encryptionService;
            _appDbContext = appDbContext;
            _emailService = emailService;
        }

        // Service for login
        public async Task<AppResponse<string>> LoginUser(LoginUserDto loginUser)
        {

            var conn = _appDbContext.GetConnection();

            var query = @"Select * from Users where Email = @Email";

            var data = new
            {
                Email = loginUser.Email,
            };

            var user = await conn.QueryFirstOrDefaultAsync<Domain.Entities.User>(query, data);


            if (user is null)
            {
                return AppResponse.Fail<string>("Wrong Email Address", "Wrong Email Address", HttpStatusCodes.BadRequest);
            }
            //var descriptedPassword = _encryptionService.DecryptData(user.Password);
            if (!_encryptionService.VerifyPassword(loginUser.Password, user.Password))
            {
                return AppResponse.Fail<string>("Wrong Password", "Wrong Password", HttpStatusCodes.BadRequest);
            }

            Random random = new Random();
            int otp = random.Next(100000, 1000000);

            query = @"Insert into Otps(OtpValue,Email,OtpValidity) values (@OtpValue, @Email, @OtpValidity)";
            var otpData = new
            {
                OtpValue = otp,
                Email = loginUser.Email,
                OtpValidity = DateTime.Now.AddMinutes(5),
            };
            var rowsAffected = await conn.ExecuteAsync(query, otpData);

            var isOtpSend = await _emailService.SendEmailAsync(loginUser.Email, user.FirstName, 
                "Validate Otp for Login", $"Your Otp of Login Purpuse is {otp} and it is Validate till {DateTime.Now.AddMinutes(5)}");

            if(!isOtpSend) return AppResponse.Fail<string>("Unable to Send Otp", "Unable to Send Otp", HttpStatusCodes.InternalServerError);


            //query = @"Select UserTypeName from UserTypes where UserTypeId = @UserTypeId";

            //var userTypeName = await conn.ExecuteScalarAsync<string>(query,new { UserTypeId = user.UserTypeId});

            //var accessToken = await _jwtService.Authenticate(user.UserId, user.UserName, loginUser.Email, userTypeName);


            //LoginResponseDto loginResponseDto = user.Adapt<LoginResponseDto>();
            //loginResponseDto.AccessToken = accessToken;

            return AppResponse.Success<string>(
                    $"Otp send Successfully to {user.Email}",
                    $"Otp send Successfully to {user.Email}",
                    HttpStatusCodes.OK
                 );
        }






    }
}
