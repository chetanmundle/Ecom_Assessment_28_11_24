using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.SalesDetails;
using App.Core.Models.SalesMaster;
using Dapper;
using Domain.Entities;
using Mapster;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class SalesRepository : ISalesRepository
    {
        private readonly IAppDbContext _appDbContext;

        public SalesRepository(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

    

        public async Task<AppResponse<IEnumerable<SalesMasterDto>>> GetAllOrdersByUserIdAsync(int userId)
        {
            var query = @"Select * From SalesMaster SM Where UserId = @UserId Order by SM.InvoiceDate desc";
            var conn = _appDbContext.GetConnection();

            var orderList = await conn.QueryAsync<Domain.Entities.SalesMaster>(query, new { UserId = userId});

            return AppResponse.Success<IEnumerable<SalesMasterDto>>(orderList.Adapt<IEnumerable<SalesMasterDto>>());    

        }

        // this will get the all the orders which admin get 
        public async Task<AppResponse<IEnumerable<CustomerOrdersDto>>> GetAllCutomerOdersByAdminIdAsync(int adminId)
        {
            var query = @"

Select U.UserId, U.FirstName, U.LastName, U.Mobile, SM.DeliveryAddress, SM.DeliveryState,
       SM.DeliveryCountry, SM.DeliveryZipCode, SM.InvoiceDate, SD.SaleQuntity, SD.SellingPrice,
	   SD.SalesDetailsId, P.ProductId, P.ProductCode, p.ProductName
from   SalesDetails SD inner join 
       SalesMaster SM on SD.InvoiceId = SM.Id inner join
	   Users U on SM.UserId = U.UserId inner join
       Products p on SD.ProductId = p.ProductId 
where p.CreatedBy = @AdminId ORDER BY SM.InvoiceDate desc

                        ";

            var conn = _appDbContext.GetConnection();
            var customerOderList = await conn.QueryAsync<CustomerOrdersDto>(query, new { AdminId = adminId });

            return AppResponse.Success<IEnumerable<CustomerOrdersDto>>(customerOderList);
        }
    }
}
