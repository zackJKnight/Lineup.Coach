using Microsoft.EntityFrameworkCore;
using Lineup.Coach.Application.Interfaces;
using Lineup.Coach.Domain;


namespace Lineup.Coach.Persistence
{
    public class LineupCoachDbContext : DbContext, ILineupCoachDbContext
    {
        public LineupCoachDbContext(DbContextOptions<LineupCoachDbContext> options)
            : base(options)
        {
        }

        public DbSet<Team> Teams { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(LineupCoachDbContext).Assembly);
            //modelBuilder.Entity<Game>(game =>
            //{
            //    game.Property(prop => prop.PlayDate);
            //    game.Property(prop => prop.AvailablePlayerCount);
            //    game.Property(prop => prop.MaxPlayersOnFieldCount);
            //});
        }

    }
}
