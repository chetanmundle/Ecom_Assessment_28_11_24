using App.Core.App.Sales;
using App.Core.Interface;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Ecom_Assessment_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ISalesRepository _salesRepository;

        public SalesController(IMediator mediator, ISalesRepository salesRepository)
        {
            _mediator = mediator;
            _salesRepository = salesRepository;
        }

        // api for genereate invoice
        [HttpGet("[action]/{invoId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetInvoice(int invoId)
        {
            var result = await _mediator.Send(new GetSalesInvoceQuery { InvoId = invoId });
            return Ok(result);  
        }

        [HttpGet("[action]/{userId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetAllOrdersByUserId(int userId)
        {
            var result = await _salesRepository.GetAllOrdersByUserIdAsync(userId);
            return Ok(result);
        }


        [HttpGet("[action]/{adminId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrdersOfCutomerByAdminId(int adminId)
        {
            var result = await _salesRepository.GetAllCutomerOdersByAdminIdAsync(adminId);
            return Ok(result);
        }
    }
}
