using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Users;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.User.Commond
{
    public class UpdateUserCommand : IRequest<AppResponse>
    {
        public UpdateUserDto UpdateUserDto { get; set; }
    }

    internal class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public UpdateUserCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var updateUserDto = request.UpdateUserDto;

            var user = await _appDbContext.Set<Domain.Entities.User>()
                     .FirstOrDefaultAsync(u => u.UserId == updateUserDto.UserId, cancellationToken);

            if(user is null) return AppResponse.Response(false,"User Not found for this Id ", HttpStatusCodes.NotFound);

            var isEmailExist = await _appDbContext.Set<Domain.Entities.User>()
                         .AnyAsync(u => u.Email == updateUserDto.Email, cancellationToken);

            if (isEmailExist && !string.Equals(user.Email,updateUserDto.Email)) return AppResponse.Response(false, "Email Already Exist... Please any other Email", HttpStatusCodes.NotFound);

            user.Email = updateUserDto.Email;
            user.Address = updateUserDto.Address;
            user.DateOfBirth = updateUserDto.DateOfBirth;
            user.FirstName = updateUserDto.FirstName;
            user.LastName = updateUserDto.LastName;
            user.ProfileImage = updateUserDto.ProfileImage;
            user.Mobile = updateUserDto.Mobile;

            await _appDbContext.SaveChangesAsync(cancellationToken);

           return AppResponse.Response(true, "Data Updated Successfully", HttpStatusCodes.OK);
        }
    }
}
