using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Cart;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Cart.Command
{
    public class IncrementCartCommand : IRequest<AppResponse>
    {
        public IncrementCartQuntityDto incrementCartDto { get; set; }
    }

    internal class IncrementCartCommandHandler : IRequestHandler<IncrementCartCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public IncrementCartCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(IncrementCartCommand request, CancellationToken cancellationToken)
        {
            var incrementCartDto = request.incrementCartDto;

            if(incrementCartDto.PreviousQuntity >= 10)
            {
                return AppResponse.Response(false, "You Cannot Add More Than 10 Quntity",HttpStatusCodes.Conflict);
            }


            var product = await _appDbContext.Set<Domain.Entities.Product>()
                                .FirstOrDefaultAsync(p => p.ProductId == incrementCartDto.ProductId);

            if (product is null) return AppResponse.Response(false, "Unble to Get Recored of Product", HttpStatusCodes.NotFound);

            if (product.Stock < (incrementCartDto.PreviousQuntity + incrementCartDto.Quntity))
                return AppResponse.Response(false, "Unble to Increment Not in Stock", HttpStatusCodes.NotFound);

            var cartDetails = await (from cartMaster in _appDbContext.Set<Domain.Entities.CartMaster>()
                                     join cartDetail in _appDbContext.Set<Domain.Entities.CartDetails>()
                                     on cartMaster.CartMasterId equals cartDetail.CartId
                                     where (cartMaster.UserId == incrementCartDto.UserId && cartDetail.ProductId == incrementCartDto.ProductId)
                                     select new Domain.Entities.CartDetails
                                     {
                                         CartDetailsId = cartDetail.CartDetailsId,
                                         CartId = cartDetail.CartId,
                                         CartMaster = cartDetail.CartMaster,
                                         Product = cartDetail.Product,
                                         Quntity = cartDetail.Quntity,
                                         ProductId = cartDetail.ProductId,
                                     }).FirstOrDefaultAsync(cancellationToken: cancellationToken);

            if (cartDetails is null) return AppResponse.Response(false, "Unble to Get Recored", HttpStatusCodes.NotFound);


            cartDetails.Quntity += incrementCartDto.Quntity;

            // Explicitly mark the entity as modified to ensure EF tracks the change
            _appDbContext.DbContext.Entry(cartDetails).State = EntityState.Modified;

            await _appDbContext.SaveChangesAsync(cancellationToken: cancellationToken);

            return AppResponse.Response(true, "Increment Successfully", HttpStatusCodes.OK);
        }
    }
}
