using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Product
{
    public class UpdateProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductImage { get; set; }
        public string Category { get; set; }
        public string Brand { get; set; }
        public float SellingPrice { get; set; }
        public float PurchasePrice { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public int? Stock { get; set; }
    
    }
}
