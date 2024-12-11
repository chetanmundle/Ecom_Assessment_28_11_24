using App.Common.Constants;
using App.Common.Models;
using App.Core.Interface;
using App.Core.Interfaces;
using App.Core.Models.Product;
using Dapper;
using Domain.Entities;
using Mapster;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly IAppDbContext _appDbContext;

        public ProductRepository(IAppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }



        public async Task<AppResponse<IEnumerable<ProductDto>>> GetAllProductByUserIdAsync(int userId)
        {
            var conn = _appDbContext.GetConnection();
            var query = @"Select * From Products Where CreatedBy = @UserId and IsDeleted = 0";

            var productlist = await conn.QueryAsync<Domain.Entities.Product>(query, new { UserId = userId });

            return AppResponse.Success(
                    productlist.Adapt<IEnumerable<ProductDto>>(),
                    "Product GetSuccessfully",
                    HttpStatusCodes.OK
                 );
        }

        // Get Product By ProductId
        public async Task<AppResponse<ProductDto>> GetProductByIdAsync(int productId)
        {
            var query = @"Select * From Products where ProductId = @ProductId";
            var conn = _appDbContext.GetConnection();

            var product = await conn.QueryFirstOrDefaultAsync<Domain.Entities.Product>(query, new { ProductId = productId });

            if (product is null) return AppResponse.Fail<ProductDto>(null, "Not Record Found for this Id", HttpStatusCodes.NotFound);

            return AppResponse.Fail<ProductDto>(product.Adapt<ProductDto>(), "Not Record Found for this Id", HttpStatusCodes.NotFound);
        }

        //Get All Products
        public async Task<AppResponse<IEnumerable<ProductDto>>> GetAllProduct(string word = "")
        {
            var query = @"Select * from Products where ProductName like @searchWord and IsDeleted = 0 and Stock > 0";
            var conn = _appDbContext.GetConnection();

            var search = new
            {
                searchWord = "%" + word + "%",
            };

            var productList = await conn.QueryAsync(query, search);

            return AppResponse.Success(productList.Adapt<IEnumerable<ProductDto>>(), "Product Fetch Successfully", HttpStatusCodes.OK);
        }

        //Get all deleted Product By Id
        public async Task<AppResponse<IEnumerable<ProductDto>>> GetAllDeletedProductByUserIdAsync(int userId)
        {
            var query = @"Select * From Products Where CreatedBy = @UserId and IsDeleted = 1";
            var conn = _appDbContext.GetConnection();

            var deletedProductList = await conn.QueryAsync(query, new { UserId = userId });

            var productDto = deletedProductList.Adapt<IEnumerable<ProductDto>>();

            return AppResponse.Success<IEnumerable<ProductDto>>(productDto);
        }
    }
}
