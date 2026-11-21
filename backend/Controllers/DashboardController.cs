using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CollegeLostAndFound.API.Data;
using CollegeLostAndFound.API.DTOs;

namespace CollegeLostAndFound.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly LostAndFoundDbContext _context;

        public DashboardController(LostAndFoundDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<ActionResult<AdminDashboardStatsDto>> GetAdminStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalLost = await _context.Reports.CountAsync(r => r.Type == "Lost");
            var totalFound = await _context.Reports.CountAsync(r => r.Type == "Found");
            var pendingClaims = await _context.Claims.CountAsync(c => c.Status == "Pending");
            var returnedItems = await _context.Reports.CountAsync(r => r.Status == "Claimed" || r.Status == "Resolved");

            var cutoffUnclaimed = DateTime.UtcNow.AddDays(-14);
            var unclaimedItems = await _context.Reports
                .CountAsync(r => r.Type == "Found" &&
                                 r.Status == "Active" &&
                                 r.CreatedAt <= cutoffUnclaimed &&
                                 !r.Claims.Any(c => c.Status == "Approved"));

            var recentReports = await _context.Reports
                .Include(r => r.Category)
                .Include(r => r.Location)
                .Include(r => r.User)
                .Include(r => r.Claims)
                .OrderByDescending(r => r.CreatedAt)
                .Take(6)
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

            var recentClaims = await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Category)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Location)
                .OrderByDescending(c => c.CreatedDate)
                .Take(6)
                .Select(c => new ClaimResponseDto
                {
                    ClaimID = c.ClaimID,
                    CreatedDate = c.CreatedDate,
                    Status = c.Status,
                    Proof = c.Proof,
                    Photo = c.Photo,
                    AdminNotes = c.AdminNotes,
                    ProcessedAt = c.ProcessedAt,
                    UserID = c.UserID,
                    ClaimantUsername = c.User != null ? c.User.Username : "Unknown",
                    ClaimantEmail = c.User != null ? c.User.Email : "",
                    ClaimantPhone = c.User != null ? c.User.Phone : "",
                    ReportID = c.ReportID,
                    ReportTitle = c.Report != null ? c.Report.Title : "",
                    ReportType = c.Report != null ? c.Report.Type : "",
                    ReportPhoto = c.Report != null ? c.Report.Photo : null,
                    ReportStatus = c.Report != null ? c.Report.Status : "",
                    CategoryName = c.Report != null && c.Report.Category != null ? c.Report.Category.Name : "",
                    LocationName = c.Report != null && c.Report.Location != null ? c.Report.Location.Name : ""
                })
                .ToListAsync();

            return Ok(new AdminDashboardStatsDto
            {
                TotalUsers = totalUsers,
                TotalLostReports = totalLost,
                TotalFoundReports = totalFound,
                PendingClaims = pendingClaims,
                ReturnedItems = returnedItems,
                UnclaimedItems = unclaimedItems,
                RecentReports = recentReports,
                RecentClaims = recentClaims
            });
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<ActionResult<UserDashboardStatsDto>> GetUserStats()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var myLost = await _context.Reports.CountAsync(r => r.UserID == userId && r.Type == "Lost");
            var myFound = await _context.Reports.CountAsync(r => r.UserID == userId && r.Type == "Found");
            var myPendingClaims = await _context.Claims.CountAsync(c => c.UserID == userId && c.Status == "Pending");
            var myApprovedClaims = await _context.Claims.CountAsync(c => c.UserID == userId && c.Status == "Approved");
            var unreadNotifs = await _context.Notifications.CountAsync(n => n.UserID == userId && !n.IsRead);

            var myRecentReports = await _context.Reports
                .Include(r => r.Category)
                .Include(r => r.Location)
                .Include(r => r.User)
                .Include(r => r.Claims)
                .Where(r => r.UserID == userId)
                .OrderByDescending(r => r.CreatedAt)
                .Take(5)
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

            var myRecentClaims = await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Category)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Location)
                .Where(c => c.UserID == userId)
                .OrderByDescending(c => c.CreatedDate)
                .Take(5)
                .Select(c => new ClaimResponseDto
                {
                    ClaimID = c.ClaimID,
                    CreatedDate = c.CreatedDate,
                    Status = c.Status,
                    Proof = c.Proof,
                    Photo = c.Photo,
                    AdminNotes = c.AdminNotes,
                    ProcessedAt = c.ProcessedAt,
                    UserID = c.UserID,
                    ClaimantUsername = c.User != null ? c.User.Username : "Unknown",
                    ClaimantEmail = c.User != null ? c.User.Email : "",
                    ClaimantPhone = c.User != null ? c.User.Phone : "",
                    ReportID = c.ReportID,
                    ReportTitle = c.Report != null ? c.Report.Title : "",
                    ReportType = c.Report != null ? c.Report.Type : "",
                    ReportPhoto = c.Report != null ? c.Report.Photo : null,
                    ReportStatus = c.Report != null ? c.Report.Status : "",
                    CategoryName = c.Report != null && c.Report.Category != null ? c.Report.Category.Name : "",
                    LocationName = c.Report != null && c.Report.Location != null ? c.Report.Location.Name : ""
                })
                .ToListAsync();

            return Ok(new UserDashboardStatsDto
            {
                MyLostReports = myLost,
                MyFoundReports = myFound,
                MyPendingClaims = myPendingClaims,
                MyApprovedClaims = myApprovedClaims,
                UnreadNotifications = unreadNotifs,
                MyRecentReports = myRecentReports,
                MyRecentClaims = myRecentClaims
            });
        }
    }
}
