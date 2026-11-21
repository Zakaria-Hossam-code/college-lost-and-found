using System.Text.Json.Serialization;

namespace CollegeLostAndFound.API.Models
{
    public class Report
    {
        public int ReportID { get; set; }
        
        // Item Name / Title
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        // "Lost" or "Found"
        public string Type { get; set; } = "Lost";
        
        // "Active", "PendingClaim", "Claimed", "Resolved", "Closed"
        public string Status { get; set; } = "Active";
        
        // Date when lost or found
        public DateTime Date { get; set; } = DateTime.UtcNow;
        
        // Image URL or file path
        public string? Photo { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public int UserID { get; set; }
        public User? User { get; set; }

        public int CategoryID { get; set; }
        public Category? Category { get; set; }

        public int LocationID { get; set; }
        public Location? Location { get; set; }

        [JsonIgnore]
        public ICollection<Claim> Claims { get; set; } = new List<Claim>();
    }
}
