using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Users;
using Dapper;
using Domain.Entities;
using Mapster;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly IEncryptionService _encryptionService;
        private readonly IAppDbContext _appDbContext;
        private readonly IJwtService _jwtService;

        public UserRepository(IEncryptionService encryptionService,
            IAppDbContext appDbContext, IJwtService jwtService)
        {
            _encryptionService = encryptionService;
            _appDbContext = appDbContext;
            _jwtService = jwtService;
        }

        // Service for login
        public async Task<AppResponse<LoginResponseDto>> LoginUser(LoginUserDto loginUser)
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
                return AppResponse.Fail<LoginResponseDto>(null, "Wrong Email Address");
            }
            //var descriptedPassword = _encryptionService.DecryptData(user.Password);
            if (!_encryptionService.VerifyPassword(loginUser.Password, user.Password))
            {
                return AppResponse.Fail<LoginResponseDto>(null, "Wrong Password");
            }
            //else if (user.UserTypeId != loginUser.UserTypeId)
            //{
            //    return AppResponse.Fail<LoginResponseDto>(null, "Wrong Type Choose");
            //}

            query = @"Select UserTypeName from UserTypes where UserTypeId = @UserTypeId";

            var userTypeName = await conn.ExecuteScalarAsync<string>(query,new { UserTypeId = user.UserTypeId});

            var accessToken = await _jwtService.Authenticate(user.UserId, user.UserName, loginUser.Email, userTypeName);


            LoginResponseDto loginResponseDto = user.Adapt<LoginResponseDto>();
            loginResponseDto.AccessToken = accessToken;

            return AppResponse.Success<LoginResponseDto>(
                    loginResponseDto,
                    "User Logged in Successfully",
                    HttpStatusCodes.OK
                 );
        }

    
        
    }
}
