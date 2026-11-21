using System.ComponentModel.DataAnnotations;

namespace CollegeLostAndFound.API.DTOs
{
    public class CreateClaimDto
    {
        [Required]
        public int ReportID { get; set; }

        [Required, MinLength(10), MaxLength(2000)]
        public string Proof { get; set; } = string.Empty;

        public string? Photo { get; set; }
    }

    public class ProcessClaimDto
    {
        [Required]
        // "Approved" or "Rejected"
        public string Status { get; set; } = string.Empty;

        public string? AdminNotes { get; set; }
    }

    public class ClaimResponseDto
    {
        public int ClaimID { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; } = string.Empty; // "Pending", "Approved", "Rejected"
        public string Proof { get; set; } = string.Empty;
        public string? Photo { get; set; }
        public string? AdminNotes { get; set; }
        public DateTime? ProcessedAt { get; set; }

        public int UserID { get; set; }
        public string ClaimantUsername { get; set; } = string.Empty;
        public string ClaimantEmail { get; set; } = string.Empty;
        public string ClaimantPhone { get; set; } = string.Empty;

        public int ReportID { get; set; }
        public string ReportTitle { get; set; } = string.Empty;
        public string ReportType { get; set; } = string.Empty;
        public string? ReportPhoto { get; set; }
        public string ReportStatus { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string LocationName { get; set; } = string.Empty;
    }
}
