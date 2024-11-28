﻿
using App.Core.App.User.Commond;
using Microsoft.Extensions.DependencyInjection;


namespace App.Core
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddMediatR(mfg =>
            {
                mfg.RegisterServicesFromAssemblyContaining<CreateUserCommand>();
            });

            return services;
        }
    }
}
