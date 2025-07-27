using Microsoft.EntityFrameworkCore;
using ProjectTracker.Api.Models;

namespace ProjectTracker.Api.Data
{
    /// <summary>
    /// EF Core database context.  Provides access to the Projects table.
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects => Set<Project>();
    }
}