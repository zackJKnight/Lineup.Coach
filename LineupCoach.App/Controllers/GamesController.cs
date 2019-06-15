using Lineup.Coach.Application.Games.Commands.CreateGame;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace LineupCoach.App.Controllers
{
    public class GamesController : BaseController
    {
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesDefaultResponseType]
        public async Task<IActionResult> Create([FromBody]CreateGameCommand command)
        {
            await Mediator.Send(command);

            return NoContent();
        }
    }
}
