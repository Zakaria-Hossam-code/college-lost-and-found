using CollegeLostAndFound.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CollegeLostAndFound.API.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(LostAndFoundDbContext context)
        {
            await context.Database.EnsureCreatedAsync();

            // Seed Categories if empty
            if (!await context.Categories.AnyAsync())
            {
                var categories = new List<Category>
                {
                    new() { Name = "Electronics & Gadgets" },
                    new() { Name = "Student IDs & Cards" },
                    new() { Name = "Keys & Keychains" },
                    new() { Name = "Books & Notebooks" },
                    new() { Name = "Wallets & Purses" },
                    new() { Name = "Bags & Backpacks" },
                    new() { Name = "Clothing & Accessories" },
                    new() { Name = "Eyewear & Sunglasses" },
                    new() { Name = "Water Bottles & Tumblers" },
                    new() { Name = "Other Items" }
                };
                context.Categories.AddRange(categories);
                await context.SaveChangesAsync();
            }

            // Seed Locations if empty
            if (!await context.Locations.AnyAsync())
            {
                var locations = new List<Location>
                {
                    new() { Name = "Main Campus Library (Floor 2)" },
                    new() { Name = "Student Union Center" },
                    new() { Name = "Science & Tech Complex" },
                    new() { Name = "Engineering Hall (Room 104)" },
                    new() { Name = "Central Dining & Cafeteria" },
                    new() { Name = "Athletic Center & Gymnasium" },
                    new() { Name = "Campus Quad & Green" },
                    new() { Name = "North Campus Parking Structure" },
                    new() { Name = "Administration & Registrar Building" }
                };
                context.Locations.AddRange(locations);
                await context.SaveChangesAsync();
            }

            // Seed Users if empty
            if (!await context.Users.AnyAsync())
            {
                var adminUser = new User
                {
                    Username = "admin",
                    Email = "admin@college.edu",
                    Password = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Phone = "+1 (555) 019-9000",
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow.AddMonths(-2)
                };

                var student1 = new User
                {
                    Username = "john_doe",
                    Email = "john.doe@college.edu",
                    Password = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    Phone = "+1 (555) 014-2345",
                    Role = "User",
                    CreatedAt = DateTime.UtcNow.AddMonths(-1)
                };

                var student2 = new User
                {
                    Username = "jane_smith",
                    Email = "jane.smith@college.edu",
                    Password = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                    Phone = "+1 (555) 017-7890",
                    Role = "User",
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                };

                context.Users.AddRange(adminUser, student1, student2);
                await context.SaveChangesAsync();
            }

            // Seed Reports if empty
            if (!await context.Reports.AnyAsync())
            {
                var admin = await context.Users.FirstAsync(u => u.Role == "Admin");
                var john = await context.Users.FirstAsync(u => u.Username == "john_doe");
                var jane = await context.Users.FirstAsync(u => u.Username == "jane_smith");

                var catElectronics = await context.Categories.FirstAsync(c => c.Name.Contains("Electronics"));
                var catCards = await context.Categories.FirstAsync(c => c.Name.Contains("Student IDs"));
                var catKeys = await context.Categories.FirstAsync(c => c.Name.Contains("Keys"));
                var catBags = await context.Categories.FirstAsync(c => c.Name.Contains("Bags"));
                var catBottles = await context.Categories.FirstAsync(c => c.Name.Contains("Water Bottles"));

                var locLib = await context.Locations.FirstAsync(l => l.Name.Contains("Library"));
                var locUnion = await context.Locations.FirstAsync(l => l.Name.Contains("Student Union"));
                var locEng = await context.Locations.FirstAsync(l => l.Name.Contains("Engineering"));
                var locGym = await context.Locations.FirstAsync(l => l.Name.Contains("Athletic"));
                var locDining = await context.Locations.FirstAsync(l => l.Name.Contains("Dining"));

                var report1 = new Report
                {
                    Title = "Apple AirPods Pro 2 in White Case",
                    Description = "Lost my AirPods Pro 2nd Gen. The charging case has a small sticker residue on back and custom initials inscribed on the interior hinge. Lost while studying near the silent cubicles.",
                    Type = "Lost",
                    Status = "Active",
                    Date = DateTime.UtcNow.AddDays(-2),
                    Photo = "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
                    UserID = john.UserID,
                    CategoryID = catElectronics.CategoryID,
                    LocationID = locLib.LocationID,
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                };

                var report2 = new Report
                {
                    Title = "White AirPods Pro Wireless Earbuds",
                    Description = "Found on study desk 14 on the 2nd floor of the library. Case is in good condition with minor scratches. Turned in to the front desk.",
                    Type = "Found",
                    Status = "Active",
                    Date = DateTime.UtcNow.AddDays(-2),
                    Photo = "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
                    UserID = admin.UserID,
                    CategoryID = catElectronics.CategoryID,
                    LocationID = locLib.LocationID,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                };

                var report3 = new Report
                {
                    Title = "Student ID Card - Jane M. Smith",
                    Description = "Lost university card with student ID #9482103. Has blue campus lanyard attached. May have dropped it between the cafeteria and Student Union.",
                    Type = "Lost",
                    Status = "Active",
                    Date = DateTime.UtcNow.AddDays(-4),
                    Photo = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
                    UserID = jane.UserID,
                    CategoryID = catCards.CategoryID,
                    LocationID = locUnion.LocationID,
                    CreatedAt = DateTime.UtcNow.AddDays(-4)
                };

                var report4 = new Report
                {
                    Title = "Black North Face Borealis Backpack",
                    Description = "Found left behind under a lecture chair in room 104. Contains mechanical engineering notebooks and graph paper. No laptop inside.",
                    Type = "Found",
                    Status = "Active",
                    Date = DateTime.UtcNow.AddDays(-3),
                    Photo = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
                    UserID = jane.UserID,
                    CategoryID = catBags.CategoryID,
                    LocationID = locEng.LocationID,
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                };

                var report5 = new Report
                {
                    Title = "Brass Dorm Key with Red Honda Tag",
                    Description = "Found near dining checkout counter. Has two silver keys and a red plastic tag.",
                    Type = "Found",
                    Status = "Active",
                    Date = DateTime.UtcNow.AddDays(-5),
                    Photo = "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80",
                    UserID = john.UserID,
                    CategoryID = catKeys.CategoryID,
                    LocationID = locDining.LocationID,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                };

                var report6 = new Report
                {
                    Title = "Teal Hydro Flask 32oz Wide Mouth",
                    Description = "Found in the gym weight room. Has several national park stickers. Has remained unclaimed in gym office for over two weeks.",
                    Type = "Found",
                    Status = "Active", // Unclaimed
                    Date = DateTime.UtcNow.AddDays(-18),
                    Photo = "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
                    UserID = admin.UserID,
                    CategoryID = catBottles.CategoryID,
                    LocationID = locGym.LocationID,
                    CreatedAt = DateTime.UtcNow.AddDays(-18)
                };

                context.Reports.AddRange(report1, report2, report3, report4, report5, report6);
                await context.SaveChangesAsync();

                // Seed a sample pending claim on report2 (AirPods) by john
                var claim1 = new Claim
                {
                    ReportID = report2.ReportID,
                    UserID = john.UserID,
                    CreatedDate = DateTime.UtcNow.AddHours(-12),
                    Status = "Pending",
                    Proof = "I can provide the serial number from my Apple ID settings (starts with H3...). Inside the magnetic lid my initials 'JD' are faintly carved with a pin.",
                    Photo = "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600&auto=format&fit=crop&q=80"
                };
                context.Claims.Add(claim1);
                await context.SaveChangesAsync();

                // Seed sample notifications
                var notif1 = new Notification
                {
                    UserID = john.UserID,
                    Message = "Possible match found (90% match): Found item 'White AirPods Pro Wireless Earbuds' matches your lost report.",
                    Type = "Match",
                    LinkUrl = $"/items/{report2.ReportID}",
                    CreatedAt = DateTime.UtcNow.AddHours(-18),
                    IsRead = false
                };

                var notif2 = new Notification
                {
                    UserID = john.UserID,
                    Message = "Your ownership claim for 'White AirPods Pro Wireless Earbuds' has been submitted and is pending admin verification.",
                    Type = "ClaimSubmitted",
                    LinkUrl = "/my-claims",
                    CreatedAt = DateTime.UtcNow.AddHours(-12),
                    IsRead = true
                };

                var notif3 = new Notification
                {
                    UserID = admin.UserID,
                    Message = "New ownership claim submitted for review on item 'White AirPods Pro Wireless Earbuds'.",
                    Type = "AdminNotification",
                    LinkUrl = "/admin/claims",
                    CreatedAt = DateTime.UtcNow.AddHours(-12),
                    IsRead = false
                };

                context.Notifications.AddRange(notif1, notif2, notif3);
                await context.SaveChangesAsync();
            }
        }
    }
}
