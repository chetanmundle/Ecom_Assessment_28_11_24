using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Product;
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
    public class UpdateProductCommand : IRequest<AppResponse>
    {
        public UpdateProductDto UpdateProductDto { get; set; }
    }

    internal class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public UpdateProductCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var updateProductDto = request.UpdateProductDto;

            if(updateProductDto is null) return AppResponse.Response(false, "Data is Empety", HttpStatusCodes.BadRequest);

            if(updateProductDto.PurchasePrice > updateProductDto.SellingPrice)
                return AppResponse.Response(false, "Purchase Prise should be Less than Selling Price", HttpStatusCodes.BadRequest);

            var product = await _appDbContext.Set<Domain.Entities.Product>()
                                .FirstOrDefaultAsync(p => p.ProductId == updateProductDto.ProductId, cancellationToken);

            if(product is null) return AppResponse.Response(false, "No Data found for this Id", HttpStatusCodes.NotFound);
               
            product.ProductName = updateProductDto.ProductName;
            product.ProductImage = updateProductDto.ProductImage;
            product.Category = updateProductDto.Category;
            product.Brand = updateProductDto.Brand;
            product.SellingPrice = updateProductDto.SellingPrice;
            product.PurchaseDate = updateProductDto.PurchaseDate;
            product.PurchasePrice = updateProductDto.PurchasePrice;
            product.PurchasePrice = updateProductDto.PurchasePrice;
            product.Stock = updateProductDto.Stock;

            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true, "Data Updated Successfully", HttpStatusCodes.BadRequest);


        }
    }
}
