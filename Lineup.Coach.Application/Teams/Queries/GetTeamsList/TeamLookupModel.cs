using AutoMapper;
using Lineup.Coach.Application.Interfaces.Mapping;
using Lineup.Coach.Domain;

namespace Lineup.Coach.Application.Teams.Queries.GetTeamsList
{
    public class TeamLookupModel : IHaveCustomMapping
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public void CreateMappings(Profile configuration)
        {
            configuration.CreateMap<Team, TeamLookupModel>()
                .ForMember(cDTO => cDTO.Id, opt => opt.MapFrom(t => t.TeamId))
                .ForMember(cDTO => cDTO.Name, opt => opt.MapFrom(t => t.Name));
        }
    }
}
