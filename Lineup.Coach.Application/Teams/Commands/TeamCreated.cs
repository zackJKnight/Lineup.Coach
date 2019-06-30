using Lineup.Coach.Application.Games.Commands.CreateGame;
using Lineup.Coach.Application.Notifications;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Lineup.Coach.Application.Teams.Commands
{
    internal class TeamCreated : INotification
    {
        public string TeamCreatedId { get; set; }

        public class TeamCreatedHandler : INotificationHandler<TeamCreated>
        {
            private readonly INotificationService _notification;

            public TeamCreatedHandler(INotificationService notification)
            {
                _notification = notification;
            }

            public async Task Handle(TeamCreated notification, CancellationToken cancellationToken)
            {
                await _notification.SendAsync(new Message());
            }

        }
    }
}
