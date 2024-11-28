
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class CartDetails
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CartDetailsId { get; set; }
        [ForeignKey("CartMaster")]
        public int? CartId { get; set; }
        [ForeignKey("Product")]
        public int? ProductId { get; set; }
        public int? Quntity { get; set; }
        public CartMaster CartMaster { get; set; }
        public Product Product { get; set; }
    }
}
