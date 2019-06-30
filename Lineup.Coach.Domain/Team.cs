using System;
using System.Collections.Generic;

namespace Lineup.Coach.Domain
{
    public class Team
    {
        public string TeamId { get; set; }
        public string Name { get; set; }
        public List<Player> Roster { get; set; }
        public List<Game> Games { get; set; }

        public Team()
        {
        }

    }
}