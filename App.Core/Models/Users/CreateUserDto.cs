﻿using System;

namespace App.Core.Models.Users
{
    public class CreateUserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int? UserTypeId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public int? ZipCode { get; set; }
        public string ProfileImage { get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; }
    }
}
