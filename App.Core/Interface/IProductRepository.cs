using App.Common.Models;
using App.Core.Models.Product;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface IProductRepository
    {
        Task<AppResponse<IEnumerable<ProductDto>>> GetAllProductByUserIdAsync(int userId);
        Task<AppResponse<ProductDto>> GetProductByIdAsync(int productId);
        Task<AppResponse<IEnumerable<ProductDto>>> GetAllProduct(string serachWord = "");
    }
}
