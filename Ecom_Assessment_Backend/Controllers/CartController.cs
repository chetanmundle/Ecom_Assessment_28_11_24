using App.Core.App.Cart.Command;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Card;
using App.Core.Models.Cart;
using App.Core.Models.Stripe;
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

        //Api for Increment Item to cart
        [HttpPut("[action]")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> IncrementItemInCart(IncrementCartQuntityDto incrementDto)
        {
            var result = await _mediator.Send(new IncrementCartCommand { incrementCartDto = incrementDto });
            return Ok(result);
        } 
        
        
        
        //Api for Decrement Item to cart
        [HttpPut("[action]")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> DecrementItemInCart(IncrementCartQuntityDto incrementtDto)
        {
            var result = await _mediator.Send(new DecrementCartCommand { decrementCartDto = incrementtDto });
            return Ok(result);
        }

        //Api for Remove Item from cart
        [HttpDelete("[action]/{cartDetailId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> RemoveItemFromCart(int cartDetailId)
        {
            var result = await _mediator.Send(new RemoveFromCartCommand { CartDetailsId = cartDetailId });
            return Ok(result);
        }

        // Payment and Place Order
        [HttpPost("[action]")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> PaymentAndPlaceOrder(PaymentAndOrderDto paymentAndOrderDto)
        {
            var result = await _mediator.Send(new PaymentAndOrderCommand { PaymentAndOrderDto = paymentAndOrderDto });
            return Ok(result);
        }

        // Payment and Place Order
        [HttpPost("[action]")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> StripePaymentAndPlaceOrder(Striprequestmodel paymentAndOrderDto)
        {
            var result = await _mediator.Send(new StripPaymentAndOrderCommand { stripeModel = paymentAndOrderDto });
            return Ok(result);
        }
    }
}
