using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Users;
using App.Core.Validations.Users;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Commond
{
    public class CreateUserCommand : IRequest<AppResponse<UserWithoutPassDto>>
    {
        public CreateUserDto CreateUserDto { get; set; }
    }

    internal class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, AppResponse<UserWithoutPassDto>>
    {
        private readonly IAppDbContext _appDbContext;
        private readonly IEncryptionService _encryptionService;
        private readonly IEmailService _emailService;
        private readonly IEmailSmtpService _emailSmtpService;

        public CreateUserCommandHandler(IAppDbContext appDbContext, IEncryptionService encryptionService,
            IEmailService emailService, IEmailSmtpService emailSmtpService)
        {
            _appDbContext = appDbContext;
            _encryptionService = encryptionService;
            _emailService = emailService;
            _emailSmtpService = emailSmtpService;
        }
        public async Task<AppResponse<UserWithoutPassDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var createUserDto = request.CreateUserDto;
            var validator = new CreateUserDtoValidator();
            var validate = validator.Validate(createUserDto);

            if (!validate.IsValid)
            {
                var errorMessage = validate.Errors[0].ErrorMessage;
                return AppResponse.Fail<UserWithoutPassDto>(null, errorMessage, HttpStatusCodes.BadRequest);
            }

            var user = createUserDto.Adapt<Domain.Entities.User>();

            // Creating UserName
            user.UserName = ("EC_" + user.LastName + user.FirstName[0] + user.DateOfBirth.Value.ToString("ddMMyy")).ToUpper();
            var password = GeneratePassword();
            //user.UserName = _encryptionService.EncryptData(username);
            user.Password = _encryptionService.EncryptData(password);

            // checking email exist or not
            var isEmailExist = await _appDbContext.Set<Domain.Entities.User>()
                                .FirstOrDefaultAsync(u => user.Email == u.Email,cancellationToken);
            if (isEmailExist is not null)
            {
                return AppResponse.Fail<UserWithoutPassDto>(
                      null,
                    "Email is Alread Exist",
                    HttpStatusCodes.BadRequest);
            }

            // Checking username is already exist
            var coutUsernameStartsWith = await _appDbContext.Set<Domain.Entities.User>()
                                              .CountAsync(u => u.UserName.StartsWith(user.UserName), cancellationToken);
           
            if(coutUsernameStartsWith > 0)
            {
                user.UserName = user.UserName.ToUpper() + coutUsernameStartsWith.ToString();
            }
         

            await _appDbContext.Set<Domain.Entities.User>().AddAsync(user, cancellationToken);

            await _appDbContext.SaveChangesAsync(cancellationToken);

            //await _emailService.SendEmailAsync(user.Email,
            //    user.FirstName + user.LastName,
            //    "Congratulation Mail", 
            //    $"Congratulation Your Account is Created Successfully and your Email : {user.Email} Uername : {user.UserName} and Password : {password} ");

            _emailSmtpService.SendWlcomeEmail(user.Email, user.FirstName + user.LastName, "Account Opening  Mail", user.UserName, password);

            return AppResponse.Success<UserWithoutPassDto>(
                    user.Adapt<UserWithoutPassDto>(),
                    "User Created Successfully",
                    HttpStatusCodes.OK
                );
        }

        private static string GeneratePassword()
        {

            var random = new Random();
            int length = random.Next(8, 11);

            // Character for getting the values
            const string upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowerCase = "abcdefghijklmnopqrstuvwxyz";
            const string numbers = "0123456789";
            const string specialCharacters = "!@#$%^&*()-_=+;:.<>?";

            // Appending the At least one From the Above....
            var password = new StringBuilder();
            password.Append(upperCase[random.Next(upperCase.Length)]);
            password.Append(lowerCase[random.Next(lowerCase.Length)]);
            password.Append(numbers[random.Next(numbers.Length)]);
            password.Append(specialCharacters[random.Next(specialCharacters.Length)]);

            // Fill the rest of the password length with a mix of all characters
            string allCharacters = upperCase + lowerCase + numbers + specialCharacters;
            for (int i = 4; i < length; i++)
            {
                password.Append(allCharacters[random.Next(allCharacters.Length)]);
            }

            // Shuffle the password to ensure randomness
            return new string(password.ToString().OrderBy(_ => random.Next()).ToArray());
        }
    }


}
