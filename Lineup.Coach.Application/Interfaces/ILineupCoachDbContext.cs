using System.Threading;
using System.Threading.Tasks;
using Lineup.Coach.Domain;
using Microsoft.EntityFrameworkCore;

namespace Lineup.Coach.Application.Interfaces
{
    public interface ILineupCoachDbContext
    {
        DbSet<Team> Teams { get; set; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
