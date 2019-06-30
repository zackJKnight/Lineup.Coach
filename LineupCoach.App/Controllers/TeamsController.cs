using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Lineup.Coach.Domain;
using Lineup.Coach.Persistence;
using Lineup.Coach.Application.Teams.Commands;
using Microsoft.AspNetCore.Http;
using Lineup.Coach.Application.Teams.Queries.GetTeamsList;

namespace LineupCoach.App.Controllers
{
    public class TeamsController : BaseController
    {
        // GET: Teams
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<TeamsListViewModel>> GetAll()
        {
            return Ok(await Mediator.Send(new GetTeamsListQuery()));
        }
    }
}
