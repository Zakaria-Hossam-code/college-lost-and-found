using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using CollegeLostAndFound.API.Data;
using CollegeLostAndFound.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure Database Provider
var configuredProvider = builder.Configuration["DatabaseProvider"] ?? "SqlServer";
var sqlServerConn = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=CollegeLostAndFoundDb;Trusted_Connection=True;TrustServerCertificate=True;Connect Timeout=5;";
var sqliteConn = builder.Configuration.GetConnectionString("SqliteConnection") 
    ?? "Data Source=lostandfound.db";

// Resilient DbContext registration:
// If SqlServer is selected, test connectivity; if unavailable in current machine environment, fallback to SQLite.
bool useSqlServer = false;
if (configuredProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
{
    try
    {
        using var testConn = new Microsoft.Data.SqlClient.SqlConnection(sqlServerConn);
        testConn.Open();
        useSqlServer = true;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[NOTICE] SQL Server connection attempt ({sqlServerConn}): {ex.Message}");
        Console.WriteLine("[NOTICE] Falling back to SQLite database for active session runtime persistence.");
        useSqlServer = false;
    }
}

if (useSqlServer)
{
    Console.WriteLine("[DB] Using Microsoft SQL Server database provider.");
    builder.Services.AddDbContext<LostAndFoundDbContext>(options =>
        options.UseSqlServer(sqlServerConn));
}
else
{
    Console.WriteLine("[DB] Using SQLite database provider for reliable local development.");
    builder.Services.AddDbContext<LostAndFoundDbContext>(options =>
        options.UseSqlite(sqliteConn));
}

// Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "CollegeLostAndFoundManagementSystemSecretKey2026!MustBeVeryLong";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CollegeLostAndFoundAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "CollegeLostAndFoundClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Register application services
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IMatchingService, MatchingService>();

var app = builder.Build();

// Enable Static Files (for uploads)
var webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
var uploadsDir = Path.Combine(webRoot, "uploads");
if (!Directory.Exists(uploadsDir))
{
    Directory.CreateDirectory(uploadsDir);
}
app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Initialize and Seed Database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LostAndFoundDbContext>();
    try
    {
        await DbInitializer.SeedAsync(context);
        Console.WriteLine("[DB] Database initialized and seeded successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[DB SEED ERROR] {ex.Message}");
    }
}

app.Run();
