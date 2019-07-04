using Lineup.Coach.Application.Interfaces;
using Lineup.Coach.Application.Notifications;
using System.Threading.Tasks;

namespace LineupCoach.Infrastructure
{
    public class NotificationService : INotificationService
    {
        public Task SendAsync(Message message)
        {
            return Task.CompletedTask;
        }
    }
}
