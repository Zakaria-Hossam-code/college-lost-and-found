namespace CollegeLostAndFound.API.DTOs
{
    public class NotificationResponseDto
    {
        public int NotificationID { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? LinkUrl { get; set; }
    }
}
