using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
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
    }
}
