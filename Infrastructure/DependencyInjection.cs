using App.Core.Interface;
using App.Core.Interfaces;
using Infrastructure.context;
using Infrastructure.Repository;
using Infrastructure.service;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services,
           IConfigurationManager configuration)
        {
            // Bind Database context
            services.AddScoped<IAppDbContext, AppDbContext>();

            // Register the Domain Service
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ICountryStateRepository, CountryStateRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ICartRepository, CartRepository>();

            //Register Jwt Service
            services.AddScoped<IJwtService, JwtService>();

            // Encription/ Decription Service
            services.AddScoped<IEncryptionService, EncryptionService>();

            //Register Email
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IEmailSmtpService, EmailSmtpService>();


            services.AddDbContext<AppDbContext>((provider, options) =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                        b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName));
            });

            return services;
        }
    }
}
