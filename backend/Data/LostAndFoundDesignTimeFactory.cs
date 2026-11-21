using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace CollegeLostAndFound.API.Data
{
    public class LostAndFoundDesignTimeFactory : IDesignTimeDbContextFactory<LostAndFoundDbContext>
    {
        public LostAndFoundDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<LostAndFoundDbContext>();
            optionsBuilder.UseSqlServer("Server=localhost;Database=CollegeLostAndFoundDb;Trusted_Connection=True;TrustServerCertificate=True;");

            return new LostAndFoundDbContext(optionsBuilder.Options);
        }
    }
}
