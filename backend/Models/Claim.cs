namespace CollegeLostAndFound.API.Models
{
    public class Claim
    {
        public int ClaimID { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // "Pending", "Approved", "Rejected"
        public string Status { get; set; } = "Pending";
        
        // Proof of ownership details provided by claimant
        public string Proof { get; set; } = string.Empty;
        
        // Optional photo proving ownership (receipt, earlier photo with item, serial number photo, etc.)
        public string? Photo { get; set; }
        
        // Rejection reason or approval notes from administrator
        public string? AdminNotes { get; set; }
        
        public DateTime? ProcessedAt { get; set; }

        // Foreign keys
        public int UserID { get; set; }
        public User? User { get; set; }

        public int ReportID { get; set; }
        public Report? Report { get; set; }
    }
}
