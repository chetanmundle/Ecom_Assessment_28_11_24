using App.Core.Models.Product;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Validations.Product
{
    public class CreateProductDtoValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductDtoValidator()
        {
            RuleFor(x => x.ProductName).NotEmpty().NotNull();
            RuleFor(x => x.Category).NotEmpty().NotNull();
            RuleFor(x => x.Brand).NotEmpty().NotNull();
            RuleFor(x => x.PurchasePrice).NotEmpty().NotNull();
            RuleFor(x => x.SellingPrice).NotEmpty().NotNull().GreaterThan(x=> x.PurchasePrice);
            RuleFor(x => x.PurchaseDate).NotEmpty().NotNull();
            RuleFor(x => x.Stock).NotEmpty().NotNull().GreaterThanOrEqualTo(1);
            RuleFor(x => x.CreatedBy).NotEmpty().NotNull();

        }
    }
}
