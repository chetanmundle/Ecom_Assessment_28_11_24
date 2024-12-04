

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class SalesDetails
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SalesDetailsId { get; set; }
        [ForeignKey("SalesMaster")]
        public int InvoiceId { get; set; }
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public int  SaleQuntity { get; set; }
        public float SellingPrice { get; set; }

        public SalesMaster SalesMaster { get; set; }
    }
}
