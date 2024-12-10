using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.SalesMaster
{
    public class SalesMasterDto
    {
        public int Id { get; set; }
        public string InvoiceId { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public float SubTotal { get; set; }
        public int UserId { get; set; }
        public string DeliveryAddress { get; set; }
        public int? DeliveryZipCode { get; set; }
        public string DeliveryState { get; set; }
        public string DeliveryCountry { get; set; }
        public string PaymentId { get; set; }
    }
}
