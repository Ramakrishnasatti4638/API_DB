using SyncfusionLibrary;
using Microsoft.EntityFrameworkCore;
public class ApplicationDBContext : DbContext, IDisposable
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }
    public DbSet<Users> users { get; set; }
    public DbSet<Books> books { get; set; }
    public DbSet<Borrows> borrows { get; set; }
}