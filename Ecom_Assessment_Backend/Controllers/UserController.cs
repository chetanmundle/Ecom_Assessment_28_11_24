using App.Core.App.User.Commond;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Users;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
            var result = await _mediator.Send(new CreateUserCommand { CreateUserDto = createUserDto});
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

       

    }
}
