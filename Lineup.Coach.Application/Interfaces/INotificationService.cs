using System.Threading.Tasks;
using Lineup.Coach.Application.Notifications;

namespace Lineup.Coach.Application.Interfaces
{
    public interface INotificationService
    {
        Task SendAsync(Message message);
    }
}