using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.Core.Models.Users
{
    public class LoginUserDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        //public int? UserTypeId { get; set; }
    }
}
