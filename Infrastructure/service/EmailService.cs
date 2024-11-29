using App.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
   
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<bool> SendEmailAsync(string toE,string name, string subject, string message)
        {
            var apiKey = "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";
            //Console.WriteLine(apiKey);

            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("chetanmundlesd@gmail.com","Chetan Mundle");
            var to = new EmailAddress(toE,name);
            var plaintext = message;
            var htmlcontent = "";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plaintext, htmlcontent);
            var response =await client.SendEmailAsync(msg);


            return true;
        }
    }
}
