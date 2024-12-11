using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Product.Command
{
    public class RestoreProductCommand : IRequest<AppResponse>
    {
        public int productId { get; set; }
    }

    internal class RestoreProductCommandHandler : IRequestHandler<RestoreProductCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public RestoreProductCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(RestoreProductCommand request, CancellationToken cancellationToken)
        {
            var productId = request.productId;

            var product = await _appDbContext.Set<Domain.Entities.Product>()
                               .FirstOrDefaultAsync(p => p.ProductId == productId, cancellationToken);

            if(product is null) 
                return AppResponse.Response(false, "Product with this id not Found",HttpStatusCodes.NotFound);

            product.IsDeleted = false;

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true, "Product Restore Successfully", HttpStatusCodes.OK);
        }
    }
}
