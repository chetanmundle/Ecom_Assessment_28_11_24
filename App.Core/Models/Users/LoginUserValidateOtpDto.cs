﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Users
{
    public class LoginUserValidateOtpDto
    {
        public string Email { get; set; }
        public int OtpValue { get; set; }

    }
}
