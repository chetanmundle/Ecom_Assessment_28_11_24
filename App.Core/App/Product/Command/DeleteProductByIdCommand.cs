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
    public class DeleteProductByIdCommand : IRequest<AppResponse>
    {
        public int ProductId { get; set; }
    }

    internal class DeleteProductByIdCommandHandler : IRequestHandler<DeleteProductByIdCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public DeleteProductByIdCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(DeleteProductByIdCommand request, CancellationToken cancellationToken)
        {
            var product = await _appDbContext.Set<Domain.Entities.Product>()
                                .FirstOrDefaultAsync(p => p.ProductId == request.ProductId, cancellationToken);

            if(product is null) return AppResponse.Response(false, "Product with this Id not Exist..!",HttpStatusCodes.NotFound);

            product.IsDeleted = true;

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true, "Product Deleted Successfully!", HttpStatusCodes.NotFound);
        }
    }


}
