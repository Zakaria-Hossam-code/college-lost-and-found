using CollegeLostAndFound.API.Data;
using CollegeLostAndFound.API.Models;

namespace CollegeLostAndFound.API.Services
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(int userId, string message, string type, string? linkUrl = null);
    }

    public class NotificationService : INotificationService
    {
        private readonly LostAndFoundDbContext _context;

        public NotificationService(LostAndFoundDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(int userId, string message, string type, string? linkUrl = null)
        {
            var notification = new Notification
            {
                UserID = userId,
                Message = message,
                Type = type,
                LinkUrl = linkUrl,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
    }
}
