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

        // Get all cartitems with details of product
        public async Task<AppResponse<IEnumerable<CartItemDetailsDto>>> GetAllCartItemDetailsByUserIdAsync(int userId)
        {
            var query = @"Select CM.UserId, CM.CartMasterId, CD.CartDetailsId, CD.ProductId, CD.Quntity,P.ProductId, P.ProductName,
			                     P.ProductImage, P.SellingPrice, P.Stock, P.Brand, P.Category, P.ProductCode
                          From        CartsMaster CM
                          Inner Join  CartDetails CD
                          On          CM.CartMasterId = CD.CartId 
                          Inner Join  Products P
                          On          P.ProductId = CD.ProductId
                          Where       CM.UserId = @UserId";

            var conn = _appDbContext.GetConnection();
            var cartDetails = await conn.QueryAsync<CartItemDetailsDto>(query, new {UserId = userId});

            return AppResponse.Success<IEnumerable<CartItemDetailsDto>>(cartDetails,"Data fetch Successfully",HttpStatusCodes.OK);
        }
    }
}
