using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Lineup.Coach.Domain;

namespace Lineup.Coach.Persistence
{
    public class LineupCoachDbContext : DbContext
    {
        public LineupCoachDbContext(DbContextOptions<LineupCoachDbContext> options)
            : base(options)
        {
        }

        public DbSet<Team> Teams { get; set; }
    }
}
