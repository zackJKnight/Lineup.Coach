using System;
using System.Collections.Generic;

namespace Lineup.Coach.Domain
{
    public class Team
    {
        public Team()
        {
            Players = new HashSet<Player>();
            Games = new HashSet<Game>();
        }
        public string TeamId { get; set; }
        public string Name { get; set; }
        public ICollection<Game> Games { get; private set; }
        public ICollection<Player> Players { get; private set; }        
    }
}
