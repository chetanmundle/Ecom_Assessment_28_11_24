using App.Common.Models;
using App.Core.Models.SalesDetails;
using App.Core.Models.SalesMaster;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Interface
{
    public interface ISalesRepository
    {
        Task<AppResponse<IEnumerable<SalesMasterDto>>> GetAllOrdersByUserIdAsync(int userId);
        Task<AppResponse<IEnumerable<CustomerOrdersDto>>> GetAllCutomerOdersByAdminIdAsync(int adminId);
    }
}
