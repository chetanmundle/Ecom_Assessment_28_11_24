

using App.Core.Models.SalesDetails;
using System;
using System.Collections;
using System.Collections.Generic;

namespace App.Core.Models.Cart
{
    public class InvoiceDto
    {
        public int InvoId {get;set;}  // Primary key Invoice
        public string InvoiceId {get;set;}
        public string Name {get;set;}
        public string phone { get; set; }
        public string Address { get; set; }
        public string StateName { get; set; }
        public string CountryName { get; set; }
        public int? ZipCode { get; set; }
        public DateTime InvoiceDate { get; set; }
        public float SubTotal { get; set; }
        public IEnumerable<SalesDetailsofInvoiceDto> SalesDetailofInvoce { get; set; }
    }
}
