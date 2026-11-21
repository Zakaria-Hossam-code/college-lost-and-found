using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CollegeLostAndFound.API.Data;
using CollegeLostAndFound.API.DTOs;
using CollegeLostAndFound.API.Models;
using CollegeLostAndFound.API.Services;

namespace CollegeLostAndFound.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly LostAndFoundDbContext _context;
        private readonly IMatchingService _matchingService;
        private readonly IWebHostEnvironment _env;

        public ReportsController(
            LostAndFoundDbContext context,
            IMatchingService matchingService,
            IWebHostEnvironment env)
        {
            _context = context;
            _matchingService = matchingService;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<List<ReportResponseDto>>> GetAll([FromQuery] ReportFilterDto filter)
        {
            var query = _context.Reports
                .Include(r => r.Category)
                .Include(r => r.Location)
                .Include(r => r.User)
                .Include(r => r.Claims)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var term = filter.Search.Trim().ToLower();
                query = query.Where(r => r.Title.ToLower().Contains(term) || r.Description.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(filter.Type) && !filter.Type.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(r => r.Type.ToLower() == filter.Type.Trim().ToLower());
            }

            if (filter.CategoryID.HasValue && filter.CategoryID.Value > 0)
            {
                query = query.Where(r => r.CategoryID == filter.CategoryID.Value);
            }

            if (filter.LocationID.HasValue && filter.LocationID.Value > 0)
            {
                query = query.Where(r => r.LocationID == filter.LocationID.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.Status) && !filter.Status.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(r => r.Status.ToLower() == filter.Status.Trim().ToLower());
            }

            if (filter.FromDate.HasValue)
            {
                query = query.Where(r => r.Date >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                query = query.Where(r => r.Date <= filter.ToDate.Value);
            }

            var reports = await query
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReportResponseDto
                {
                    ReportID = r.ReportID,
                    Title = r.Title,
                    Description = r.Description,
                    Type = r.Type,
                    Status = r.Status,
                    Date = r.Date,
                    Photo = r.Photo,
                    CreatedAt = r.CreatedAt,
                    UserID = r.UserID,
                    Username = r.User != null ? r.User.Username : "Unknown",
                    UserEmail = r.User != null ? r.User.Email : "",
                    UserPhone = r.User != null ? r.User.Phone : "",
                    CategoryID = r.CategoryID,
                    CategoryName = r.Category != null ? r.Category.Name : "",
                    LocationID = r.LocationID,
                    LocationName = r.Location != null ? r.Location.Name : "",
                    ClaimsCount = r.Claims.Count
                })
                .ToListAsync();

            return Ok(reports);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReportResponseDto>> GetById(int id)
        {
            var r = await _context.Reports
                .Include(r => r.Category)
                .Include(r => r.Location)
                .Include(r => r.User)
                .Include(r => r.Claims)
                .FirstOrDefaultAsync(r => r.ReportID == id);

            if (r == null)
                return NotFound(new { message = "Report not found." });

            return Ok(new ReportResponseDto
            {
                ReportID = r.ReportID,
                Title = r.Title,
                Description = r.Description,
                Type = r.Type,
                Status = r.Status,
                Date = r.Date,
                Photo = r.Photo,
                CreatedAt = r.CreatedAt,
                UserID = r.UserID,
                Username = r.User?.Username ?? "Unknown",
                UserEmail = r.User?.Email ?? "",
                UserPhone = r.User?.Phone ?? "",
                CategoryID = r.CategoryID,
                CategoryName = r.Category?.Name ?? "",
                LocationID = r.LocationID,
                LocationName = r.Location?.Name ?? "",
                ClaimsCount = r.Claims.Count
            });
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ReportResponseDto>> Create([FromBody] CreateReportDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryID == dto.CategoryID);
            if (!categoryExists)
                return BadRequest(new { message = "Selected category does not exist." });

            var locationExists = await _context.Locations.AnyAsync(l => l.LocationID == dto.LocationID);
            if (!locationExists)
                return BadRequest(new { message = "Selected location does not exist." });

            var report = new Report
            {
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                Type = dto.Type.Equals("Found", StringComparison.OrdinalIgnoreCase) ? "Found" : "Lost",
                Status = "Active",
                Date = dto.Date,
                Photo = dto.Photo,
                UserID = userId,
                CategoryID = dto.CategoryID,
                LocationID = dto.LocationID,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reports.Add(report);
            await _context.SaveChangesAsync();

            // Run matching notification in background if found item
            _ = Task.Run(async () =>
            {
                try
                {
                    using var scope = HttpContext.RequestServices.CreateScope();
                    var matchingService = scope.ServiceProvider.GetRequiredService<IMatchingService>();
                    await matchingService.CheckAndNotifyMatchesForNewReportAsync(report);
                }
                catch
                {
                    // Ignore background notification exceptions
                }
            });

            return await GetById(report.ReportID);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<ReportResponseDto>> Update(int id, [FromBody] UpdateReportDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var report = await _context.Reports.FindAsync(id);
            if (report == null)
                return NotFound(new { message = "Report not found." });

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirstValue(ClaimTypes.Role);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var isAdmin = roleClaim == "Admin";
            if (report.UserID != userId && !isAdmin)
                return Forbid();

            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryID == dto.CategoryID);
            if (!categoryExists)
                return BadRequest(new { message = "Selected category does not exist." });

            var locationExists = await _context.Locations.AnyAsync(l => l.LocationID == dto.LocationID);
            if (!locationExists)
                return BadRequest(new { message = "Selected location does not exist." });

            report.Title = dto.Title.Trim();
            report.Description = dto.Description.Trim();
            report.Status = dto.Status;
            report.CategoryID = dto.CategoryID;
            report.LocationID = dto.LocationID;
            report.Date = dto.Date;
            if (!string.IsNullOrEmpty(dto.Photo))
            {
                report.Photo = dto.Photo;
            }

            await _context.SaveChangesAsync();
            return await GetById(report.ReportID);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report == null)
                return NotFound(new { message = "Report not found." });

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirstValue(ClaimTypes.Role);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var isAdmin = roleClaim == "Admin";
            if (report.UserID != userId && !isAdmin)
                return Forbid();

            _context.Reports.Remove(report);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Report deleted successfully." });
        }

        [HttpGet("{id}/matches")]
        public async Task<ActionResult<List<MatchResultDto>>> GetMatches(int id)
        {
            var matches = await _matchingService.FindMatchesForReportAsync(id);
            return Ok(matches);
        }

        [Authorize]
        [HttpGet("user/my-reports")]
        public async Task<ActionResult<List<ReportResponseDto>>> GetMyReports()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var reports = await _context.Reports
                .Include(r => r.Category)
                .Include(r => r.Location)
                .Include(r => r.User)
                .Include(r => r.Claims)
                .Where(r => r.UserID == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReportResponseDto
                {
                    ReportID = r.ReportID,
                    Title = r.Title,
                    Description = r.Description,
                    Type = r.Type,
                    Status = r.Status,
                    Date = r.Date,
                    Photo = r.Photo,
                    CreatedAt = r.CreatedAt,
                    UserID = r.UserID,
                    Username = r.User != null ? r.User.Username : "Unknown",
                    UserEmail = r.User != null ? r.User.Email : "",
                    UserPhone = r.User != null ? r.User.Phone : "",
                    CategoryID = r.CategoryID,
                    CategoryName = r.Category != null ? r.Category.Name : "",
                    LocationID = r.LocationID,
                    LocationName = r.Location != null ? r.Location.Name : "",
                    ClaimsCount = r.Claims.Count
                })
                .ToListAsync();

            return Ok(reports);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin/unclaimed")]
        public async Task<ActionResult<List<ReportResponseDto>>> GetUnclaimedItems([FromQuery] int daysOld = 14)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-daysOld);

            var unclaimed = await _context.Reports
                .Include(r => r.Category)
                .Include(r => r.Location)
                .Include(r => r.User)
                .Include(r => r.Claims)
                .Where(r => r.Type == "Found" &&
                            r.Status == "Active" &&
                            r.CreatedAt <= cutoffDate &&
                            !r.Claims.Any(c => c.Status == "Approved"))
                .OrderByDescending(r => r.Date)
                .Select(r => new ReportResponseDto
                {
                    ReportID = r.ReportID,
                    Title = r.Title,
                    Description = r.Description,
                    Type = r.Type,
                    Status = r.Status,
                    Date = r.Date,
                    Photo = r.Photo,
                    CreatedAt = r.CreatedAt,
                    UserID = r.UserID,
                    Username = r.User != null ? r.User.Username : "Unknown",
                    UserEmail = r.User != null ? r.User.Email : "",
                    UserPhone = r.User != null ? r.User.Phone : "",
                    CategoryID = r.CategoryID,
                    CategoryName = r.Category != null ? r.Category.Name : "",
                    LocationID = r.LocationID,
                    LocationName = r.Location != null ? r.Location.Name : "",
                    ClaimsCount = r.Claims.Count
                })
                .ToListAsync();

            return Ok(unclaimed);
        }

        [Authorize]
        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return BadRequest(new { message = "Only JPG, PNG, WEBP and GIF images are allowed." });

            if (file.Length > 10 * 1024 * 1024)
                return BadRequest(new { message = "File size cannot exceed 10MB." });

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/uploads/{uniqueFileName}";
            return Ok(new { url = fileUrl });
        }
    }
}
