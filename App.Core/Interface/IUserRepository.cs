using App.Common.Models;
using App.Core.Models.Users;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface IUserRepository
    {
        Task<AppResponse<string>> LoginUser(LoginUserDto loginUser);
        //Task<AppResponse<LoginResponseDto>> LoginUser(LoginUserDto loginUser);
    }
}
