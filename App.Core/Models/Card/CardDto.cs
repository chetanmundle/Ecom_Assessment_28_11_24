using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Card
{
    public class CardDto
    {
        public string CardNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? CVV { get; set; }
    }
}
