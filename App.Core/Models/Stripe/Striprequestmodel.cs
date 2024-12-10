namespace App.Core.Models.Stripe
{
    public class Striprequestmodel
    {
        public int UserId { get; set; }
        public string SourceToken { get; set; }
        public int Amount { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string Address { get; set; }
        public string StateName { get; set; }
        public string CountryName { get; set; }
        public int? ZipCode { get; set; }
    }
}
