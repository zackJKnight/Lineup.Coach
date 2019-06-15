using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Lineup.Coach.Application.Interfaces;
using Lineup.Coach.Domain;
using System.Threading;
using System.Threading.Tasks;

namespace Lineup.Coach.Persistence
{
    public class LineupCoachDbContext : DbContext, ILineupCoachDbContext
    {
        public LineupCoachDbContext(DbContextOptions<LineupCoachDbContext> options)
            : base(options)
        {
        }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Game> Games { get; set; }

        public DbSet<Player> Players { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(LineupCoachDbContext).Assembly);
            modelBuilder.Entity<Game>(game =>
            {
                game.Property(prop => prop.PlayDate);
                game.Property(prop => prop.AvailablePlayerCount);
                game.Property(prop => prop.MaxPlayersOnFieldCount);
            });
        }

        Task ILineupCoachDbContext.SaveChangesAsync(CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
