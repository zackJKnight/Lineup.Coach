using System;
using System.Collections.Generic;

namespace Lineup.Coach.Domain
{
    public class Team
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<Player> Roster { get; set; }
        public List<Game> Games { get; set; }

        public Team(string name)
        {
            this.Name = name;
            this.Roster = new List<Player>();
        }
    }
}