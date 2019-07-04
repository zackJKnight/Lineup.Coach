using AutoMapper;
using AutoMapper.QueryableExtensions;
using Lineup.Coach.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Lineup.Coach.Application.Teams.Queries.GetTeamsList
{
    public class GetTeamsListQueryHandler : IRequestHandler<GetTeamsListQuery, TeamsListViewModel>
    {
        private readonly ILineupCoachDbContext _context;
        private readonly IMapper _mapper;

        public GetTeamsListQueryHandler(ILineupCoachDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<TeamsListViewModel> Handle(GetTeamsListQuery request, CancellationToken cancellationToken)
        {
            var TeamsListVM = new TeamsListViewModel
            {
                Teams = await _context.Teams.ProjectTo<TeamLookupModel>(_mapper.ConfigurationProvider).ToListAsync(cancellationToken)
            };
            _mapper.Map<TeamsListViewModel>(TeamsListVM);
            return TeamsListVM;
        }
    }
}
