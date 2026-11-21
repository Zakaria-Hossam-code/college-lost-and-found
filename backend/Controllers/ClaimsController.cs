using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CollegeLostAndFound.API.Data;
using CollegeLostAndFound.API.DTOs;
using CollegeLostAndFound.API.Models;
using CollegeLostAndFound.API.Services;
using ClaimEntity = CollegeLostAndFound.API.Models.Claim;

namespace CollegeLostAndFound.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : ControllerBase
    {
        private readonly LostAndFoundDbContext _context;
        private readonly INotificationService _notificationService;

        public ClaimsController(LostAndFoundDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<ClaimResponseDto>>> GetAll([FromQuery] string? status)
        {
            var query = _context.Claims
                .Include(c => c.User)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Category)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Location)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(c => c.Status.ToLower() == status.Trim().ToLower());
            }

            var claims = await query
                .OrderByDescending(c => c.CreatedDate)
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

            return Ok(claims);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ClaimResponseDto>> GetById(int id)
        {
            var c = await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Category)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Location)
                .FirstOrDefaultAsync(c => c.ClaimID == id);

            if (c == null)
                return NotFound(new { message = "Claim not found." });

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirstValue(ClaimTypes.Role);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            if (c.UserID != userId && roleClaim != "Admin")
                return Forbid();

            return Ok(new ClaimResponseDto
            {
                ClaimID = c.ClaimID,
                CreatedDate = c.CreatedDate,
                Status = c.Status,
                Proof = c.Proof,
                Photo = c.Photo,
                AdminNotes = c.AdminNotes,
                ProcessedAt = c.ProcessedAt,
                UserID = c.UserID,
                ClaimantUsername = c.User?.Username ?? "Unknown",
                ClaimantEmail = c.User?.Email ?? "",
                ClaimantPhone = c.User?.Phone ?? "",
                ReportID = c.ReportID,
                ReportTitle = c.Report?.Title ?? "",
                ReportType = c.Report?.Type ?? "",
                ReportPhoto = c.Report?.Photo,
                ReportStatus = c.Report?.Status ?? "",
                CategoryName = c.Report?.Category?.Name ?? "",
                LocationName = c.Report?.Location?.Name ?? ""
            });
        }

        [Authorize]
        [HttpGet("user/my-claims")]
        public async Task<ActionResult<List<ClaimResponseDto>>> GetMyClaims()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var claims = await _context.Claims
                .Include(c => c.User)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Category)
                .Include(c => c.Report)
                    .ThenInclude(r => r!.Location)
                .Where(c => c.UserID == userId)
                .OrderByDescending(c => c.CreatedDate)
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

            return Ok(claims);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ClaimResponseDto>> Create([FromBody] CreateClaimDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            var report = await _context.Reports.FindAsync(dto.ReportID);
            if (report == null)
                return NotFound(new { message = "Report not found." });

            if (report.Type != "Found")
                return BadRequest(new { message = "Claims can only be filed against Found items." });

            if (report.Status == "Claimed" || report.Status == "Resolved")
                return BadRequest(new { message = "This item has already been claimed or resolved." });

            // Check if user already submitted a pending claim on this report
            var existingClaim = await _context.Claims
                .AnyAsync(c => c.ReportID == dto.ReportID && c.UserID == userId && c.Status == "Pending");

            if (existingClaim)
                return BadRequest(new { message = "You already have a pending claim for this item." });

            var claim = new ClaimEntity
            {
                ReportID = dto.ReportID,
                UserID = userId,
                Proof = dto.Proof.Trim(),
                Photo = dto.Photo,
                Status = "Pending",
                CreatedDate = DateTime.UtcNow
            };

            _context.Claims.Add(claim);
            await _context.SaveChangesAsync();

            // Notify user
            await _notificationService.CreateNotificationAsync(
                userId,
                $"Your ownership claim for '{report.Title}' has been submitted and is under admin review.",
                "ClaimSubmitted",
                "/my-claims"
            );

            // Notify admins
            var adminUsers = await _context.Users.Where(u => u.Role == "Admin").ToListAsync();
            foreach (var admin in adminUsers)
            {
                await _notificationService.CreateNotificationAsync(
                    admin.UserID,
                    $"New claim submitted for verification on '{report.Title}'.",
                    "AdminNotification",
                    "/admin/claims"
                );
            }

            return await GetById(claim.ClaimID);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{id}/process")]
        public async Task<ActionResult<ClaimResponseDto>> ProcessClaim(int id, [FromBody] ProcessClaimDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var claim = await _context.Claims
                .Include(c => c.Report)
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.ClaimID == id);

            if (claim == null)
                return NotFound(new { message = "Claim not found." });

            var status = dto.Status.Trim();
            if (status != "Approved" && status != "Rejected")
                return BadRequest(new { message = "Status must be either 'Approved' or 'Rejected'." });

            claim.Status = status;
            claim.AdminNotes = dto.AdminNotes?.Trim();
            claim.ProcessedAt = DateTime.UtcNow;

            if (status == "Approved" && claim.Report != null)
            {
                // Update report status to Claimed
                claim.Report.Status = "Claimed";

                // Notify claimant of approval
                var approvalMsg = $"Great news! Your ownership claim for '{claim.Report.Title}' was APPROVED. Please bring your student ID to the Campus Lost & Found Office for item pickup.";
                if (!string.IsNullOrWhiteSpace(dto.AdminNotes))
                {
                    approvalMsg += $" Notes: {dto.AdminNotes}";
                }
                await _notificationService.CreateNotificationAsync(claim.UserID, approvalMsg, "ClaimApproved", "/my-claims");

                // Auto-reject other pending claims on this report
                var otherClaims = await _context.Claims
                    .Where(c => c.ReportID == claim.ReportID && c.ClaimID != claim.ClaimID && c.Status == "Pending")
                    .ToListAsync();

                foreach (var other in otherClaims)
                {
                    other.Status = "Rejected";
                    other.AdminNotes = "Item was verified and claimed by another claimant.";
                    other.ProcessedAt = DateTime.UtcNow;

                    await _notificationService.CreateNotificationAsync(
                        other.UserID,
                        $"Your claim for '{claim.Report.Title}' was closed because the item was verified and returned to another claimant.",
                        "ClaimRejected",
                        "/my-claims"
                    );
                }
            }
            else if (status == "Rejected" && claim.Report != null)
            {
                var rejectionMsg = $"Your ownership claim for '{claim.Report.Title}' was not approved.";
                if (!string.IsNullOrWhiteSpace(dto.AdminNotes))
                {
                    rejectionMsg += $" Reason: {dto.AdminNotes}";
                }
                await _notificationService.CreateNotificationAsync(claim.UserID, rejectionMsg, "ClaimRejected", "/my-claims");
            }

            await _context.SaveChangesAsync();
            return await GetById(claim.ClaimID);
        }
    }
}
