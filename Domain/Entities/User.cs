﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }   // AutoGenerated
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }     // System Generated
        public string Password { get; set; }    // System Generated
        public string Email { get; set; }
        public int? UserTypeId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Mobile { get; set; }
        public string Address { get; set; }
        public int? ZipCode { get; set; }
        public string ProfileImage {  get; set; }
        public int? StateId { get; set; }
        public int? CountryId { get; set; } 
        
    }
}
