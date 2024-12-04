using App.Common.Constants;
using App.Common.Models;
using App.Core.Interfaces;
using App.Core.Models.Cart;
using App.Core.Models.SalesDetails;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace App.Core.App.Sales
{
    public class GetSalesInvoceQuery : IRequest<AppResponse<InvoiceDto>>
    {
        public int InvoId { get; set; }  // invoice id
    }

    internal class GetSalesInvoceQueryHandler : IRequestHandler<GetSalesInvoceQuery, AppResponse<InvoiceDto>>
    {
        private readonly IAppDbContext _appDbContext;

        public GetSalesInvoceQueryHandler(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse<InvoiceDto>> Handle(GetSalesInvoceQuery request, CancellationToken cancellationToken)
        {
            var invoId = request.InvoId;


            var salesMaster = await _appDbContext.Set<Domain.Entities.SalesMaster>()
                              .FirstOrDefaultAsync(sm => sm.Id == invoId, cancellationToken);

            if (salesMaster is null) return AppResponse.Fail<InvoiceDto>(null,
                " No Data found for this Invoice Id", HttpStatusCodes.NotFound);

            var salesDetailsList = await _appDbContext.Set<Domain.Entities.SalesDetails>()
                                   .Where(sd => sd.InvoiceId == invoId).ToListAsync(cancellationToken);

            List<SalesDetailsofInvoiceDto> salesDetailsofInvoiceDtoList = new List<SalesDetailsofInvoiceDto>();
            foreach (var item in salesDetailsList)
            {
                var product = await _appDbContext.Set<Domain.Entities.Product>()
                              .FirstOrDefaultAsync(p => p.ProductId == item.ProductId, cancellationToken);

                var salesDetailsofInvoceDto = new SalesDetailsofInvoiceDto()
                {
                    ProductId = item.ProductId,
                    ProductCode = item.ProductCode,
                    ProductName = product.ProductName,
                    ProductBrand = product.Brand,
                    SaleQuntity = item.SaleQuntity,
                    SalesDetailsId = item.SalesDetailsId,
                    SellingPrice = item.SellingPrice,

                };

                salesDetailsofInvoiceDtoList.Add(salesDetailsofInvoceDto);
            }

            var user = await _appDbContext.Set<Domain.Entities.User>()
                .FirstOrDefaultAsync(u => u.UserId == salesMaster.UserId);

            if(user is null) return AppResponse.Fail<InvoiceDto>(null,
                " No User found for this Invoice Id", HttpStatusCodes.NotFound);

            var invoiceDto = new InvoiceDto()
            {
                InvoId = invoId,
                InvoiceId = salesMaster.InvoiceId,
                Address = salesMaster.DeliveryAddress,
                StateName = salesMaster.DeliveryState,
                CountryName = salesMaster.DeliveryCountry,
                ZipCode = salesMaster.DeliveryZipCode,
                InvoiceDate = salesMaster.InvoiceDate ?? DateTime.Now,
                SubTotal = salesMaster.SubTotal,
                Name = user.FirstName + " " + user.LastName,
                phone = user.Mobile,

                SalesDetailofInvoce = salesDetailsofInvoiceDtoList
            };

            return AppResponse.Success<InvoiceDto>(invoiceDto,"Date Fetch Successfully");

        }
    }



}
