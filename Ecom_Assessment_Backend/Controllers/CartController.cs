using App.Core.App.Cart.Command;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Cart;
using Infrastructure.Repository;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Ecom_Assessment_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {

        private readonly IMediator _mediator;
        private readonly ICartRepository _cartRepository;

        public CartController(IMediator mediator, ICartRepository cartRepository)
        {
            _mediator = mediator;
            _cartRepository = cartRepository;
        }

        //Api for Add Item to cart
        [HttpPost("[action]")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> AddToCart(AddToCartDto addToCartDto)
        {
            var result = await _mediator.Send(new AddToCartCommand { AddToCartDto = addToCartDto });
            return Ok(result);
        }


        [HttpGet("[action]/{userId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetAllCartItemByUserId(int userId)
        {
            var result = await _cartRepository.GetAllCartItemOfUserByUserIdAsync(userId);
            return Ok(result);
        }

        // GEt all cartItems with Details
        [HttpGet("[action]/{userId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetAllCartItemWithDetailsByUserId(int userId)
        {
            var result = await _cartRepository.GetAllCartItemDetailsByUserIdAsync(userId);
            return Ok(result);
        }
    }
}
