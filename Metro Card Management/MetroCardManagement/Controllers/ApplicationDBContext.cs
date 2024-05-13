using MetroCardManagement;
using Microsoft.EntityFrameworkCore;
public class ApplicationDBContext : DbContext, IDisposable
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }

    public DbSet<Users> users { get; set; }
    public DbSet<Travel> travels { get; set; }
    public DbSet<Fair> fairs { get; set; }
}