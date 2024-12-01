using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Product;
using App.Core.Validations.Product;
using Mapster;
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
    public class CreateProductCommand :IRequest<AppResponse>
    {
        public CreateProductDto CreateProductDto { get; set; }
    }

    internal class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, AppResponse>
    {
        private readonly IAppDbContext _appDbContext;

        public CreateProductCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var productDtoModel = request.CreateProductDto;

            var validator = new CreateProductDtoValidator();
            var validate = validator.Validate(productDtoModel);

            if (!validate.IsValid)
            {
                var errorMessage = validate.Errors[0].ErrorMessage;
                return AppResponse.Response(false, errorMessage,HttpStatusCodes.BadRequest);
            }

            if (productDtoModel is null) return AppResponse.Response(false, "Model is Empty", HttpStatusCodes.BadRequest);

            //var totoalProduct = await _appDbContext.Set<Domain.Entities.Product>()
            //                          .CountAsync(cancellationToken);
            //totoalProduct += 1;
            //var productCode = "PD" + totoalProduct.ToString().PadLeft(4, '0');

            var product = productDtoModel.Adapt<Domain.Entities.Product>();
            product.IsDeleted = false;
            //product.ProductCode  = productCode;

            await _appDbContext.Set<Domain.Entities.Product>().
                   AddAsync(product, cancellationToken);

            await _appDbContext.SaveChangesAsync(cancellationToken);

          
            product.ProductCode = "PD" + product.ProductId.ToString().PadLeft(4, '0');
            await _appDbContext.SaveChangesAsync(cancellationToken);

            return AppResponse.Response(true, "Product Created Successfully", HttpStatusCodes.OK);

        }
    }
}
