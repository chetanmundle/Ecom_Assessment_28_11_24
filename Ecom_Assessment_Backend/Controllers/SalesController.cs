using App.Core.App.Sales;
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


        public SalesController(IMediator mediator)
        {
            _mediator = mediator;

        }

        // api for genereate invoice
        [HttpGet("[action]/{invoId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetInvoice(int invoId)
        {
            var result = await _mediator.Send(new GetSalesInvoceQuery { InvoId = invoId });
            return Ok(result);  
        }
    }
}
