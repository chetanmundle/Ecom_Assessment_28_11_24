using App.Core.App.User.Commond;
using App.Core.Interface;
using App.Core.Models.Users;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Ecom_Assessment_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUserRepository _userRepository;

        public UserController(IMediator mediator, IUserRepository userRepository)
        {
            _mediator = mediator;
            _userRepository = userRepository;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateUser(CreateUserDto createUserDto)
        {
            var result = await _mediator.Send(new CreateUserCommand { CreateUserDto = createUserDto });
            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> LoginUser(LoginUserDto loginUserDto)
        {
            var result = await _userRepository.LoginUser(loginUserDto);
            return Ok(result);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> LoginUserValidateOtp(LoginUserValidateOtpDto loginUserValidateOtpDto)
        {
            var result = await _mediator.Send(new LoginUserValidateOtpCommand { LoginUserValidateOtpDto = loginUserValidateOtpDto });
            return Ok(result);
        }

        // Api for Change Password
        [HttpPost("[action]")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordDto forgetPasswordDto)
        {
            var result = await _mediator.Send(new ForgetPasswordCommond { ForgetPasswordDto = forgetPasswordDto });
            return Ok(result);
        }



    }
}
