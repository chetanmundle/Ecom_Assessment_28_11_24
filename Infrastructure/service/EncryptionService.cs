using App.Core.Interface;
using Microsoft.AspNetCore.DataProtection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EncryptionService : IEncryptionService
    {
        private readonly IDataProtector _protector;

        public EncryptionService(IDataProtectionProvider provider)
        {
            _protector = provider.CreateProtector("anythiskeyforprotect");
        }

        // Convert plaintext in cipher text
        public string EncryptData(string plainText)
        {
            return _protector.Protect(plainText);
        }

        // Convert Ciphertext into plaintext
        public string DecryptData(string encryptedData)
        {
           return _protector.Unprotect(encryptedData);
        }

        
    }
}
