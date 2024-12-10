using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.SalesMaster;
using App.Core.Models.Stripe;
using Domain.Entities;
using Mapster;
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
    public class StripPaymentAndOrderCommand : IRequest<AppResponse<SalesMasterDto>>
    {
        public Striprequestmodel stripeModel;
    }

    internal class StripPaymentAndOrderCommandHandler : IRequestHandler<StripPaymentAndOrderCommand, AppResponse<SalesMasterDto>>
    {

        private readonly IAppDbContext _appDbContext;
        private readonly IEmailSmtpService _emailSmtpService;
        private readonly IStripePaymentService _stripePaymentService;

        public StripPaymentAndOrderCommandHandler(IAppDbContext appDbContext,
            IEmailSmtpService emailSmtpService,
            IStripePaymentService stripePaymentService)
        {
            _appDbContext = appDbContext;
            _emailSmtpService = emailSmtpService;
            _stripePaymentService = stripePaymentService;
        }

        public async Task<AppResponse<SalesMasterDto>> Handle(StripPaymentAndOrderCommand request, CancellationToken cancellationToken)
        {
            var paymentAndOrderDto = request.stripeModel;

            // Checking Valid User 
            var user = await _appDbContext.Set<Domain.Entities.User>()
                        .FirstOrDefaultAsync(u => u.UserId == paymentAndOrderDto.UserId);
            if (user is null) return AppResponse.Fail<SalesMasterDto>(null, "User is not Valid", HttpStatusCodes.NotFound);


            var cartDetailsList = await(from cartMaster in _appDbContext.Set<Domain.Entities.CartMaster>()
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


            if (!cartDetailsList.Any())
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

            // Do payment here
            var paymentInfo = await _stripePaymentService.CreateStripePayment(paymentAndOrderDto);
            if(!paymentInfo.IsSuccess)
            {
                return AppResponse.Fail<SalesMasterDto>(null, "Your Payment Fail", HttpStatusCodes.NotFound);
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
                PaymentId = paymentInfo.Data.Id,
            };

            // Add Entry in SalesMaster Table 
            await _appDbContext.Set<Domain.Entities.SalesMaster>()
                  .AddAsync(salesMaster, cancellationToken);
            await _appDbContext.SaveChangesAsync(cancellationToken);

            salesMaster.InvoiceId = "ORD" + salesMaster.Id.ToString().PadLeft(3, '0');
            await _appDbContext.SaveChangesAsync(cancellationToken);

            string body = "Your Order is Confirmed.....!   <br><br><br>";

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

                body += product.ProductName + " X " + salesDetails.SaleQuntity.ToString() + " = $" +
                    (product.SellingPrice * salesDetails.SaleQuntity).ToString() + " <br>";

                await _appDbContext.Set<Domain.Entities.SalesDetails>()
                       .AddAsync(salesDetails, cancellationToken);

                product.Stock = product.Stock - item.Quntity;

                _appDbContext.Set<Domain.Entities.CartDetails>()
                    .Remove(item);

                // Saving the all changes
                await _appDbContext.SaveChangesAsync(cancellationToken);
            }

            body += " <br><br> Your SubTotal is  $" + subTotal.ToString() + "<br><br> Thankyou!!!";
            _emailSmtpService.SendEmailForConfirmOrder(user.Email, user.FirstName, "Order Confirmation ECom", user.UserName, body);

            //var
            return AppResponse.Success<SalesMasterDto>(salesMaster.Adapt<SalesMasterDto>(),
                "Card Order Placed", HttpStatusCodes.NotFound);
        }
    }
}
