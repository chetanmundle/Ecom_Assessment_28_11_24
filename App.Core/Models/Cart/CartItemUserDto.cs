﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Cart
{
    public  class CartItemUserDto
    {
        public int CartMasterId { get; set; }
        public int UserId { get; set; }
        public int CartDetailsId { get; set; }
        public int ProductId { get; set; }
        public int Quntity { get; set; }

    }
}
