
using App.Core.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Data;


namespace Infrastructure.context
{
    public class AppDbContext : DbContext, IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {
            
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<CartMaster> CartsMaster { get; set; }
        public DbSet<CartDetails> CartDetails { get; set; }
        public DbSet<SalesMaster> SalesMaster { get; set; }
        public DbSet<SalesDetails> SalesDetails { get; set; }
        public DbSet<UserType> UserTypes { get; set; }


        // For Dapper
        public IDbConnection GetConnection()
        {
            return this.Database.GetDbConnection();
        }


    }
}
