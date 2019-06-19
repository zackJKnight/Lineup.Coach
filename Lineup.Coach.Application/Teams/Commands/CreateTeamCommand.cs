using Lineup.Coach.Application.Interfaces;
using Lineup.Coach.Domain;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Lineup.Coach.Application.Teams.Commands
{
    public class CreateTeamCommand : IRequest
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public class Handler : IRequestHandler<CreateTeamCommand, Unit>
        {
            private readonly ILineupCoachDbContext _context;
            private readonly IMediator _mediator;

            public Handler(ILineupCoachDbContext context, IMediator mediator)
            {
                _context = context;
                _mediator = mediator;
            }

            public async Task<Unit> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
            {
                var entity = new Team
                {
                    TeamId = request.Id,
                    Name = request.Name
                };

                _context.Teams.Add(entity);

                await _context.SaveChangesAsync(cancellationToken);

                await _mediator.Publish(new TeamCreated { TeamId = entity.TeamId }, cancellationToken);

                return Unit.Value;
            }
        }
    }
}
