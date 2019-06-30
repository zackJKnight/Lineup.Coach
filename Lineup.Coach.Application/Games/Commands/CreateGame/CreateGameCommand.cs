using System;
using System.Threading;
using System.Threading.Tasks;
using Lineup.Coach.Application.Interfaces;
using Lineup.Coach.Domain;
using MediatR;

namespace Lineup.Coach.Application.Games.Commands.CreateGame
{
    //public class CreateGameCommand : IRequest
    //{
    //    public string Id { get; set; }
    //    public DateTime PlayDate { get; set; }
    //    public class Handler : IRequestHandler<CreateGameCommand, Unit>
    //    {
    //        private readonly ILineupCoachDbContext _context;
    //        private readonly IMediator _mediator;

    //        public Handler(ILineupCoachDbContext context, IMediator mediator)
    //        {
    //            _context = context;
    //            _mediator = mediator;
    //        }

    //        public async Task<Unit> Handle(CreateGameCommand request, CancellationToken cancellationToken)
    //        {
    //            var entity = new Game
    //            {
    //                GameId = request.Id
    //            };

    //            _context.Games.Add(entity);

    //            await _context.SaveChangesAsync(cancellationToken);

    //            await _mediator.Publish(new GameCreated { GameId = entity.GameId }, cancellationToken);

    //            return Unit.Value;
    //        }
    //    }
    //}
}
