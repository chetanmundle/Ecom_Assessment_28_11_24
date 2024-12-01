using App.Core.App.Product.Command;
using App.Core.Interface;
using App.Core.Models.Product;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Ecom_Assessment_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IProductRepository _productRepository;

        public ProductController(IMediator mediator, IProductRepository productRepository)
        {
            _mediator = mediator;
            _productRepository = productRepository;
        }

        // Api for Create the New Product
        [HttpPost("[action]")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProduct(CreateProductDto createProductDto)
        {
            var result = await _mediator.Send(new CreateProductCommand { CreateProductDto = createProductDto });  
            return Ok(result);
        }

        // Api for Get all the Product of perticular Admin
        [HttpGet("[action]/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetProcutByUserId(int userId)
        {
            var result = await _productRepository.GetAllProductByUserIdAsync(userId);
            return Ok(result);
        }

        // Delete Product By Product Id
        [HttpDelete("[action]/{productId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProductById(int productId)
        {
            var result = await _mediator.Send(new DeleteProductByIdCommand { ProductId = productId });
            return Ok(result);
        }
    }
}
