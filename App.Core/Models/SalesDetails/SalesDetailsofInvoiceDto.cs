
namespace App.Core.Models.SalesDetails
{
    public class SalesDetailsofInvoiceDto
    {
        public int SalesDetailsId { get; set; }

        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string ProductBrand { get; set; }
        public int SaleQuntity { get; set; }
        public float SellingPrice { get; set; }
    }
}
