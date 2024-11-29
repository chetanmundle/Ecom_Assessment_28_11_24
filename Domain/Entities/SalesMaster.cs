using System.ComponentModel.DataAnnotations;
using System;

namespace Domain.Entities
{
    public class SalesMaster
    {
        [Key]
        public string InvoiceId { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public float SubTotal { get; set; }
        public string DeliveryAddress { get; set; }
        public int? DeliveryZipCode { get; set; }
        public string DeliveryState { get; set; }
        public string DeliveryCountry { get; set; }
    }
}
