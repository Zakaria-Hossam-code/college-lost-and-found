namespace CollegeLostAndFound.API.DTOs
{
    public class AdminDashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalLostReports { get; set; }
        public int TotalFoundReports { get; set; }
        public int PendingClaims { get; set; }
        public int ReturnedItems { get; set; } // Claimed / Resolved
        public int UnclaimedItems { get; set; } // Found items still active after 14 days or without approved claims
        public List<ReportResponseDto> RecentReports { get; set; } = new();
        public List<ClaimResponseDto> RecentClaims { get; set; } = new();
    }

    public class UserDashboardStatsDto
    {
        public int MyLostReports { get; set; }
        public int MyFoundReports { get; set; }
        public int MyPendingClaims { get; set; }
        public int MyApprovedClaims { get; set; }
        public int UnreadNotifications { get; set; }
        public List<ReportResponseDto> MyRecentReports { get; set; } = new();
        public List<ClaimResponseDto> MyRecentClaims { get; set; } = new();
    }
}
