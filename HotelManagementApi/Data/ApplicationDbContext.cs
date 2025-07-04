// Data/ApplicationDbContext.cs
using HotelManagementApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelManagementApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Room>()
                .HasIndex(r => r.RoomNumber)
                .IsUnique();

            // Seed initial data
            modelBuilder.Entity<User>().HasData(
                new User { UserId = 1, Username = "admin", Password = "admin123", Role = "Admin" },
                new User { UserId = 2, Username = "reception", Password = "reception123", Role = "Receptionist" }
            );

            modelBuilder.Entity<Room>().HasData(
                new Room { RoomId = 1, RoomNumber = "101", Type = "Single", PricePerDay = 100.00m, Status = "Available" },
                new Room { RoomId = 2, RoomNumber = "102", Type = "Double", PricePerDay = 150.00m, Status = "Available" },
                new Room { RoomId = 3, RoomNumber = "201", Type = "Deluxe", PricePerDay = 250.00m, Status = "Available" }
            );
        }
    }
}