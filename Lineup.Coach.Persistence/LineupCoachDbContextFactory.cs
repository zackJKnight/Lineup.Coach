using Lineup.Coach.Persistence.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lineup.Coach.Persistence
{
    public class LineupCoachDbContextFactory : DesignTimeDbContextFactoryBase<LineupCoachDbContext>
    {
        protected override LineupCoachDbContext CreateNewInstance(DbContextOptions<LineupCoachDbContext> options)
        {
            return new LineupCoachDbContext(options);
        }
    }

}
