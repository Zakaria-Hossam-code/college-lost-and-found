using Microsoft.EntityFrameworkCore;
using CollegeLostAndFound.API.Data;
using CollegeLostAndFound.API.DTOs;
using CollegeLostAndFound.API.Models;

namespace CollegeLostAndFound.API.Services
{
    public interface IMatchingService
    {
        Task<List<MatchResultDto>> FindMatchesForReportAsync(int reportId);
        Task CheckAndNotifyMatchesForNewReportAsync(Report newReport);
    }

    public class MatchingService : IMatchingService
    {
        private readonly LostAndFoundDbContext _context;
        private readonly INotificationService _notificationService;

        private static readonly HashSet<string> StopWords = new(StringComparer.OrdinalIgnoreCase)
        {
            "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "with",
            "my", "i", "lost", "found", "is", "was", "it", "of", "from", "by", "has", "have"
        };

        public MatchingService(LostAndFoundDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<List<MatchResultDto>> FindMatchesForReportAsync(int reportId)
        {
            var target = await _context.Reports
                .Include(r => r.Category)
                .Include(r => r.Location)
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReportID == reportId);

            if (target == null) return new List<MatchResultDto>();

            var oppositeType = target.Type.Equals("Lost", StringComparison.OrdinalIgnoreCase) ? "Found" : "Lost";

            var candidates = await _context.Reports
                .Include(r => r.Category)
                .Include(r => r.Location)
                .Include(r => r.User)
                .Where(r => r.Type.ToLower() == oppositeType.ToLower() && r.Status != "Resolved" && r.Status != "Closed")
                .ToListAsync();

            var results = new List<MatchResultDto>();

            foreach (var candidate in candidates)
            {
                var (score, reasons) = CalculateSimilarity(target, candidate);
                if (score >= 35)
                {
                    results.Add(new MatchResultDto
                    {
                        MatchedReport = new ReportResponseDto
                        {
                            ReportID = candidate.ReportID,
                            Title = candidate.Title,
                            Description = candidate.Description,
                            Type = candidate.Type,
                            Status = candidate.Status,
                            Date = candidate.Date,
                            Photo = candidate.Photo,
                            CreatedAt = candidate.CreatedAt,
                            UserID = candidate.UserID,
                            Username = candidate.User?.Username ?? "Unknown",
                            UserEmail = candidate.User?.Email ?? "",
                            UserPhone = candidate.User?.Phone ?? "",
                            CategoryID = candidate.CategoryID,
                            CategoryName = candidate.Category?.Name ?? "",
                            LocationID = candidate.LocationID,
                            LocationName = candidate.Location?.Name ?? ""
                        },
                        SimilarityScore = score,
                        MatchReasons = reasons
                    });
                }
            }

            return results.OrderByDescending(r => r.SimilarityScore).ToList();
        }

        public async Task CheckAndNotifyMatchesForNewReportAsync(Report newReport)
        {
            // Only notify when a "Found" item is reported, to alert users who reported matching "Lost" items
            if (!newReport.Type.Equals("Found", StringComparison.OrdinalIgnoreCase))
                return;

            var matches = await FindMatchesForReportAsync(newReport.ReportID);

            foreach (var match in matches)
            {
                if (match.SimilarityScore >= 55)
                {
                    var lostReport = await _context.Reports.FindAsync(match.MatchedReport.ReportID);
                    if (lostReport != null && lostReport.UserID != newReport.UserID)
                    {
                        var message = $"Possible match found ({match.SimilarityScore}% match): A found item '{newReport.Title}' matches your lost report '{lostReport.Title}'.";
                        await _notificationService.CreateNotificationAsync(
                            lostReport.UserID,
                            message,
                            "Match",
                            $"/items/{newReport.ReportID}"
                        );
                    }
                }
            }
        }

        private static (int score, List<string> reasons) CalculateSimilarity(Report r1, Report r2)
        {
            int score = 0;
            var reasons = new List<string>();

            // 1. Category comparison (35 pts)
            if (r1.CategoryID == r2.CategoryID)
            {
                score += 35;
                reasons.Add($"Matching Category: {r1.Category?.Name ?? "Same Category"}");
            }

            // 2. Location comparison (25 pts)
            if (r1.LocationID == r2.LocationID)
            {
                score += 25;
                reasons.Add($"Matching Location: {r1.Location?.Name ?? "Same Location"}");
            }

            // 3. Date proximity comparison (up to 20 pts)
            var daysDiff = Math.Abs((r1.Date.Date - r2.Date.Date).TotalDays);
            if (daysDiff <= 3)
            {
                score += 20;
                reasons.Add($"Reported dates within {Math.Round(daysDiff)} day(s)");
            }
            else if (daysDiff <= 7)
            {
                score += 15;
                reasons.Add($"Reported dates within 1 week");
            }
            else if (daysDiff <= 14)
            {
                score += 10;
                reasons.Add($"Reported dates within 2 weeks");
            }
            else if (daysDiff <= 30)
            {
                score += 5;
                reasons.Add($"Reported dates within 1 month");
            }

            // 4. Text & Title similarity (up to 20 pts)
            var tokens1 = ExtractTokens($"{r1.Title} {r1.Description}");
            var tokens2 = ExtractTokens($"{r2.Title} {r2.Description}");

            var titleTokens1 = ExtractTokens(r1.Title);
            var titleTokens2 = ExtractTokens(r2.Title);

            var titleOverlap = titleTokens1.Intersect(titleTokens2, StringComparer.OrdinalIgnoreCase).ToList();
            var totalOverlap = tokens1.Intersect(tokens2, StringComparer.OrdinalIgnoreCase).ToList();

            if (titleOverlap.Count > 0)
            {
                score += 15;
                reasons.Add($"Common keywords in title: {string.Join(", ", titleOverlap.Take(3))}");
            }
            else if (totalOverlap.Count > 0)
            {
                score += 10;
                reasons.Add($"Common keywords in description: {string.Join(", ", totalOverlap.Take(3))}");
            }

            // Direct substring containment check (e.g., "AirPods" inside "Lost Apple AirPods Pro")
            if (r1.Title.Contains(r2.Title, StringComparison.OrdinalIgnoreCase) ||
                r2.Title.Contains(r1.Title, StringComparison.OrdinalIgnoreCase))
            {
                score += 5;
                if (!reasons.Any(r => r.Contains("title", StringComparison.OrdinalIgnoreCase)))
                {
                    reasons.Add("Item title matches closely");
                }
            }

            return (Math.Min(score, 100), reasons);
        }

        private static HashSet<string> ExtractTokens(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return new HashSet<string>();

            var delimiters = new[] { ' ', ',', '.', ';', ':', '-', '_', '(', ')', '/', '\\', '!', '?' };
            return text.Split(delimiters, StringSplitOptions.RemoveEmptyEntries)
                       .Select(t => t.Trim().ToLowerInvariant())
                       .Where(t => t.Length > 2 && !StopWords.Contains(t))
                       .ToHashSet();
        }
    }
}
