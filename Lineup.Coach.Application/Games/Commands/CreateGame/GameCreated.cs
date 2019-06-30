using Lineup.Coach.Application.Notifications;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Lineup.Coach.Application.Games.Commands.CreateGame
{
    internal class GameCreated : INotification
    {
        public string GameId { get; set; }

            public class GameCreatedHandler : INotificationHandler<GameCreated>
            {
                private readonly INotificationService _notification;

                public GameCreatedHandler(INotificationService notification)
                {
                    _notification = notification;
                }

                public async Task Handle(GameCreated notification, CancellationToken cancellationToken)
                {
                    await _notification.SendAsync(new Message());
                }
            }
    }
}