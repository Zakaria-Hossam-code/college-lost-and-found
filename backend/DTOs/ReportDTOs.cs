using System.ComponentModel.DataAnnotations;

namespace CollegeLostAndFound.API.DTOs
{
    public class CreateReportDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        // "Lost" or "Found"
        public string Type { get; set; } = "Lost";

        [Required]
        public int CategoryID { get; set; }

        [Required]
        public int LocationID { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string? Photo { get; set; }
    }

    public class UpdateReportDto
    {
        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required, MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        // "Active", "PendingClaim", "Claimed", "Resolved", "Closed"
        public string Status { get; set; } = "Active";

        [Required]
        public int CategoryID { get; set; }

        [Required]
        public int LocationID { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public string? Photo { get; set; }
    }

    public class ReportResponseDto
    {
        public int ReportID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Lost" or "Found"
        public string Status { get; set; } = string.Empty; // "Active", "PendingClaim", "Claimed", "Resolved", "Closed"
        public DateTime Date { get; set; }
        public string? Photo { get; set; }
        public DateTime CreatedAt { get; set; }

        public int UserID { get; set; }
        public string Username { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string UserPhone { get; set; } = string.Empty;

        public int CategoryID { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public int LocationID { get; set; }
        public string LocationName { get; set; } = string.Empty;

        public int ClaimsCount { get; set; }
    }

    public class ReportFilterDto
    {
        public string? Search { get; set; }
        public string? Type { get; set; } // "Lost", "Found", or null for all
        public int? CategoryID { get; set; }
        public int? LocationID { get; set; }
        public string? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class MatchResultDto
    {
        public ReportResponseDto MatchedReport { get; set; } = new();
        public int SimilarityScore { get; set; } // 0 to 100 percentage
        public List<string> MatchReasons { get; set; } = new();
    }
}
