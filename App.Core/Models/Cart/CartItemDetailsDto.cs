using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Cart
{
    public class CartItemDetailsDto
    {
        public int ProductId { get; set; }
        public int CartMasterId { get; set; }
        public int UserId { get; set; }
        public int CartDetailsId { get; set; }
        public int? Quntity { get; set; }
        public string ProductName { get; set; }
        public string ProductImage { get; set; }
        public float SellingPrice { get; set; }
        public int? Stock { get; set; }
        public string Category { get; set; }
        public string Brand { get; set; }
        public string ProductCode { get; set; }
    }
}
