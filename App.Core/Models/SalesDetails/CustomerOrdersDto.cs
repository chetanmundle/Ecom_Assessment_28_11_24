using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.SalesDetails
{
    public class CustomerOrdersDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mobile { get; set; }
        public string DeliveryAddress { get; set; }
        public int? DeliveryZipCode { get; set; }
        public string DeliveryState { get; set; }
        public string DeliveryCountry { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public int SalesDetailsId { get; set; }
        public int SaleQuntity { get; set; }
        public float SellingPrice { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
    }
}
