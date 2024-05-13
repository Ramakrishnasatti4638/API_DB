using MedicalStore;
using Microsoft.EntityFrameworkCore;
using OnlineGroceryStore;

public class ApplicationDBContext : DbContext, IDisposable
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }
    public DbSet<Users> users { get; set; }
    public DbSet<Products> products { get; set; }
    public DbSet<Items> items { get; set; }

    public DbSet<Orders> orders { get; set; }
}