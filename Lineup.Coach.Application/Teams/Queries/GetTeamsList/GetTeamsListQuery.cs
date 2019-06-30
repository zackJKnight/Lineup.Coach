using MediatR;

namespace Lineup.Coach.Application.Teams.Queries.GetTeamsList
{
    public class GetTeamsListQuery : IRequest<TeamsListViewModel>
    {
    }
}
