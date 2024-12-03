using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Cart;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Cart.Command
{
    public class DecrementCartCommand : IRequest<AppResponse>
    {
        public IncrementCartQuntityDto decrementCartDto { get; set; }
    }

    internal class DecrementCartCommandHandler : IRequestHandler<DecrementCartCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public DecrementCartCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(DecrementCartCommand request, CancellationToken cancellationToken)
        {
            var decrementCartDto = request.decrementCartDto;

            var cartDetails = await(from cartMaster in _appDbContext.Set<Domain.Entities.CartMaster>()
                                    join cartDetail in _appDbContext.Set<Domain.Entities.CartDetails>()
                                    on cartMaster.CartMasterId equals cartDetail.CartId
                                    where (cartMaster.UserId == decrementCartDto.UserId &&
                                             cartDetail.ProductId == decrementCartDto.ProductId)
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



            if((cartDetails.Quntity - decrementCartDto.Quntity) <= 0)
            {
                _appDbContext.Set<Domain.Entities.CartDetails>()
                      .Remove(cartDetails);
            }
            else
            {

                cartDetails.Quntity -= decrementCartDto.Quntity;
                // Explicitly mark the entity as modified to ensure EF tracks the change
                _appDbContext.DbContext.Entry(cartDetails).State = EntityState.Modified;
            }

          

            await _appDbContext.SaveChangesAsync(cancellationToken: cancellationToken);

            return AppResponse.Response(true, "Decrement Successfully", HttpStatusCodes.OK);
        }
    }
}
