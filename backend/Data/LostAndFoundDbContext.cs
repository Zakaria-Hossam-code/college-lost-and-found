using Microsoft.EntityFrameworkCore;
using CollegeLostAndFound.API.Models;

namespace CollegeLostAndFound.API.Data
{
    public class LostAndFoundDbContext : DbContext
    {
        public LostAndFoundDbContext(DbContextOptions<LostAndFoundDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Location> Locations => Set<Location>();
        public DbSet<Report> Reports => Set<Report>();
        public DbSet<Claim> Claims => Set<Claim>();
        public DbSet<Notification> Notifications => Set<Notification>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserID);
                entity.HasIndex(u => u.Username).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Role).IsRequired().HasMaxLength(20);
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.CategoryID);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            });

            // Location configuration
            modelBuilder.Entity<Location>(entity =>
            {
                entity.HasKey(l => l.LocationID);
                entity.Property(l => l.Name).IsRequired().HasMaxLength(150);
            });

            // Report configuration
            modelBuilder.Entity<Report>(entity =>
            {
                entity.HasKey(r => r.ReportID);
                entity.Property(r => r.Title).IsRequired().HasMaxLength(200);
                entity.Property(r => r.Description).IsRequired().HasMaxLength(2000);
                entity.Property(r => r.Type).IsRequired().HasMaxLength(20);
                entity.Property(r => r.Status).IsRequired().HasMaxLength(30);

                entity.HasOne(r => r.User)
                      .WithMany(u => u.Reports)
                      .HasForeignKey(r => r.UserID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.Category)
                      .WithMany(c => c.Reports)
                      .HasForeignKey(r => r.CategoryID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(r => r.Location)
                      .WithMany(l => l.Reports)
                      .HasForeignKey(r => r.LocationID)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Claim configuration
            modelBuilder.Entity<Claim>(entity =>
            {
                entity.HasKey(c => c.ClaimID);
                entity.Property(c => c.Status).IsRequired().HasMaxLength(30);
                entity.Property(c => c.Proof).IsRequired().HasMaxLength(2000);

                entity.HasOne(c => c.User)
                      .WithMany(u => u.Claims)
                      .HasForeignKey(c => c.UserID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Report)
                      .WithMany(r => r.Claims)
                      .HasForeignKey(c => c.ReportID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Notification configuration
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(n => n.NotificationID);
                entity.Property(n => n.Message).IsRequired().HasMaxLength(1000);

                entity.HasOne(n => n.User)
                      .WithMany(u => u.Notifications)
                      .HasForeignKey(n => n.UserID)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
