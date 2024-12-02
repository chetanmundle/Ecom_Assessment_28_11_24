using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Cart;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;


namespace App.Core.App.Cart.Command
{
    public class AddToCartCommand : IRequest<AppResponse>
    {
        public AddToCartDto AddToCartDto { get; set; }
    }

    internal class AddToCartCommandHandler : IRequestHandler<AddToCartCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public AddToCartCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(AddToCartCommand request, CancellationToken cancellationToken)
        {
            var addToCartDto = request.AddToCartDto;

            var cartMaster = await _appDbContext.Set<Domain.Entities.CartMaster>()
                                   .FirstOrDefaultAsync(cm => cm.UserId == addToCartDto.UserId);

            if (cartMaster is null)
            {
                var cartMasterData = new CartMaster();
                cartMasterData.UserId = addToCartDto.UserId;
                var z = await _appDbContext.Set<Domain.Entities.CartMaster>().AddAsync(cartMasterData, cancellationToken);
                await _appDbContext.SaveChangesAsync(cancellationToken);
                cartMaster = cartMasterData;
            }

            var product = await _appDbContext.Set<Domain.Entities.Product>()
                .FirstOrDefaultAsync(p => p.ProductId == addToCartDto.ProductId, cancellationToken);

            if (product is null) return AppResponse.Response(false,"Product With This productId not Found", HttpStatusCodes.NotFound);

            var cartDetails = new CartDetails()
            {
                CartMaster = cartMaster,
                Product = product,
                Quntity = addToCartDto.Quntity,
            };

            await _appDbContext.Set<Domain.Entities.CartDetails>().AddAsync(cartDetails, cancellationToken);

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true,"Added To Cart",HttpStatusCodes.OK);

        }
    }





}
