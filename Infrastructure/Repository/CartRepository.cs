using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Cart;
using Dapper;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CartRepository : ICartRepository
    {
        private readonly IAppDbContext _appDbContext;
        public CartRepository(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<AppResponse<IEnumerable<CartItemUserDto>>> GetAllCartItemOfUserByUserIdAsync(int userId)
        {
            var query = @"Select CM.CartMasterId,
                          CM.UserId,
	                      CD.CartDetailsId,
	                      CD.ProductId,
	                      CD.Quntity
                          From       CartsMaster CM
                          Inner join CartDetails CD
                          on         CM.CartMasterId = CD.CartId
                          Where      CM.UserId = @UserId";

            var conn = _appDbContext.GetConnection();

            var cartItemsData = await conn.QueryAsync<CartItemUserDto>(query, new { UserId = userId});

            return AppResponse.Success(cartItemsData, "Data Successfully Fetch", HttpStatusCodes.OK);
        }
    }
}
