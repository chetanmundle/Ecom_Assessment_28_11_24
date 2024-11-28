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
        private readonly IEncryptionService _encryptionService;
        private readonly IAppDbContext _appDbContext;

        public UserController(IMediator mediator,IEncryptionService e,IAppDbContext b)
        {
            _mediator = mediator;   
            _encryptionService = e;
            _appDbContext = b;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateUser(CreateUserDto createUserDto)
        {
            var result = await _mediator.Send(new CreateUserCommand { CreateUserDto = createUserDto});
            return Ok(result);
        }

       

    }
}
