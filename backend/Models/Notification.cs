namespace CollegeLostAndFound.API.Models
{
    public class Notification
    {
        public int NotificationID { get; set; }
        
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // "Match", "ClaimApproved", "ClaimRejected", "ClaimSubmitted", "StatusUpdate"
        public string Type { get; set; } = "General";
        
        // Optional link for frontend navigation (e.g., "/items/5", "/my-claims")
        public string? LinkUrl { get; set; }

        public int UserID { get; set; }
        public User? User { get; set; }
    }
}
