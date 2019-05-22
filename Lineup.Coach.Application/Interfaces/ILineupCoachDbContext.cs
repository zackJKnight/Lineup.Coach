using Lineup.Coach.Domain;
using Microsoft.EntityFrameworkCore;

namespace Lineup.Coach.Application.Interfaces
{
    public interface ILineupCoachDbContext
    {
        DbSet<Game> Games { get; set; }
        DbSet<Player> Players { get; set; }
        DbSet<Team> Teams { get; set; }
    }
}
