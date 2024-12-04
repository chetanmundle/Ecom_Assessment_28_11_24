using System.ComponentModel.DataAnnotations;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class SalesMaster
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string InvoiceId { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public float SubTotal { get; set; }
        public int UserId { get; set; }
        public string DeliveryAddress { get; set; }
        public int? DeliveryZipCode { get; set; }
        public string DeliveryState { get; set; }
        public string DeliveryCountry { get; set; }
    }
}
