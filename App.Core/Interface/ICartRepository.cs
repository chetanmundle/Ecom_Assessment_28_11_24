using App.Common.Models;
using App.Core.Models.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface ICartRepository
    {
        Task<AppResponse<IEnumerable<CartItemUserDto>>> GetAllCartItemOfUserByUserIdAsync(int userId);
    }
}
