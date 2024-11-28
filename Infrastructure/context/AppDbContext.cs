
using App.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Data;


namespace Infrastructure.context
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {
            
        }

        //public DbSet<User> Users { get; set; }

        // For Dapper
        public IDbConnection GetConnection()
        {
            return this.Database.GetDbConnection();
        }


    }
}
