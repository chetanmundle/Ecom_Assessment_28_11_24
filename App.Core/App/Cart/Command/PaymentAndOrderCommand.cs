using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Card;
using App.Core.Models.SalesMaster;
using Domain.Entities;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Cart.Command
{
    public class PaymentAndOrderCommand : IRequest<AppResponse<SalesMasterDto>>
    {
        public PaymentAndOrderDto PaymentAndOrderDto { get; set; }
    }

    internal class PaymentAndOrderCommandHandler : IRequestHandler<PaymentAndOrderCommand, AppResponse<SalesMasterDto>>
    {
        private readonly IAppDbContext _appDbContext;

        public PaymentAndOrderCommandHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse<SalesMasterDto>> Handle(PaymentAndOrderCommand request, CancellationToken cancellationToken)
        {
            var paymentAndOrderDto = request.PaymentAndOrderDto;

            //Validate card
            var card = await _appDbContext.Set<Domain.Entities.Card>()
                            .FirstOrDefaultAsync(c => c.CardNumber == paymentAndOrderDto.CardNumber &&
                                                 c.CVV == paymentAndOrderDto.CVV, cancellationToken);

            if (card is null) return AppResponse.Fail<SalesMasterDto>(null, "Wrong Card Details", HttpStatusCodes.NotFound);


            if (card.ExpiryDate?.ToString("MM/dd/yyyy") != paymentAndOrderDto.ExpiryDate?.ToString("MM/dd/yyyy"))
            {
                return AppResponse.Fail<SalesMasterDto>(null, "Wrong Expiry Date", HttpStatusCodes.NotFound);
            }

            // Checking Valid User 
            //var user = await _appDbContext.Set<Domain.Entities.User>()
            //            .FirstOrDefaultAsync(u => u.UserId == paymentAndOrderDto.UserId);
            //if (user is null) return AppResponse.Fail<SalesMasterDto>(null, "User is not Valid", HttpStatusCodes.NotFound);


            var cartDetailsList = await (from cartMaster in _appDbContext.Set<Domain.Entities.CartMaster>()
                                         join cartDetail in _appDbContext.Set<Domain.Entities.CartDetails>()
                                         on cartMaster.CartMasterId equals cartDetail.CartId
                                         where (cartMaster.UserId == paymentAndOrderDto.UserId)
                                         select new Domain.Entities.CartDetails
                                         {
                                             CartDetailsId = cartDetail.CartDetailsId,
                                             CartId = cartDetail.CartId,
                                             CartMaster = cartDetail.CartMaster,
                                             Product = cartDetail.Product,
                                             Quntity = cartDetail.Quntity,
                                             ProductId = cartDetail.ProductId,
                                         }).ToListAsync(cancellationToken: cancellationToken);


            if(!cartDetailsList.Any())
                return AppResponse.Fail<SalesMasterDto>(null, $"No Item in Cart", HttpStatusCodes.NotFound);
            //var cartProducntList = new List<Domain.Entities.Product>();
            float subTotal = 0;
            foreach (var item in cartDetailsList)
            {
                var product = await _appDbContext.Set<Domain.Entities.Product>()
                                    .FirstOrDefaultAsync(p => p.ProductId == item.ProductId, cancellationToken: cancellationToken);

                if (product is null || !(product.Stock >= item.Quntity))
                {
                    return AppResponse.Fail<SalesMasterDto>(null, $"{product.ProductName ?? ""} Not in Stock", HttpStatusCodes.NotFound);
                }

                // Find Subtotal
                subTotal += product.SellingPrice * (item.Quntity ?? 0);
                //cartProducntList.Add(product);
            }

            // Add entry to SalesMaster Table
            SalesMaster salesMaster = new SalesMaster()
            {
                InvoiceDate = DateTime.Now,
                SubTotal = subTotal,
                DeliveryAddress = paymentAndOrderDto.Address,
                DeliveryState = paymentAndOrderDto.StateName,
                DeliveryCountry = paymentAndOrderDto.CountryName,
                DeliveryZipCode = paymentAndOrderDto.ZipCode,
                UserId = paymentAndOrderDto.UserId,
            };

            // Add Entry in SalesMaster Table 
            await _appDbContext.Set<Domain.Entities.SalesMaster>()
                  .AddAsync(salesMaster, cancellationToken);
            await _appDbContext.SaveChangesAsync(cancellationToken);

            salesMaster.InvoiceId = "ORD" + salesMaster.Id.ToString().PadLeft(3, '0');
            await _appDbContext.SaveChangesAsync(cancellationToken);

            foreach (var item in cartDetailsList)
            {
                var product = await _appDbContext.Set<Domain.Entities.Product>()
                                   .FirstOrDefaultAsync(p => p.ProductId == item.ProductId, cancellationToken: cancellationToken);

                SalesDetails salesDetails = new SalesDetails()
                {
                     InvoiceId = salesMaster.Id,
                     ProductCode = product.ProductCode,
                     ProductId = product.ProductId,
                     SaleQuntity = item.Quntity ?? 0,
                     SalesMaster = salesMaster,
                     SellingPrice = product.SellingPrice,

                };

                await _appDbContext.Set<Domain.Entities.SalesDetails>()
                       .AddAsync(salesDetails, cancellationToken);

                product.Stock = product.Stock - item.Quntity;

                _appDbContext.Set<Domain.Entities.CartDetails>()
                    .Remove(item);

                // Saving the all changes
                await _appDbContext.SaveChangesAsync(cancellationToken);
            }




            //var
            return AppResponse.Success<SalesMasterDto>(salesMaster.Adapt<SalesMasterDto>(),
                "Card Order Placed", HttpStatusCodes.NotFound);
        }
    }
}
