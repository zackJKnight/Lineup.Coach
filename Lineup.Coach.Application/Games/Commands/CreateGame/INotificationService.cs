using System.Threading.Tasks;
using Lineup.Coach.Application.Notifications;

namespace Lineup.Coach.Application.Games.Commands.CreateGame
{
    internal interface INotificationService
    {
        Task SendAsync(Message message);
    }
}