using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }   // Unique
        public string  ProductImage { get; set; }
        public string Category { get; set; }
        public string Brand { get; set; }
        public string SellingPrice { get; set; }
        public string PurchasePrice { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public int? Stock {  get; set; }
        public int CreatedBy { get; set; }

    }
}
