using Lineup.Coach.Application.Games.Commands.CreateGame;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LineupCoach.App.Controllers
{
    public class GamesController : BaseController
    {
        [HttpGet]
        public ActionResult<IEnumerable<string>> GetGeneratedGame()
        {
            return new string[] { "value1", "value2" };
        }

        //[HttpPost]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[ProducesDefaultResponseType]
        //public async Task<IActionResult> Create([FromBody]CreateGameCommand command)
        //{
        //    await Mediator.Send(command);

        //    return NoContent();
        //}
    }
}
