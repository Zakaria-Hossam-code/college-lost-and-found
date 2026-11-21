using System.Text.Json.Serialization;

namespace CollegeLostAndFound.API.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        
        [JsonIgnore]
        public string Password { get; set; } = string.Empty; // Hashed password
        
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // "User" or "Admin"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<Report> Reports { get; set; } = new List<Report>();
        
        [JsonIgnore]
        public ICollection<Claim> Claims { get; set; } = new List<Claim>();
        
        [JsonIgnore]
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
