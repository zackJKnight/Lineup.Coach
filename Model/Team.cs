using System.Collections.Generic;

namespace YouthSoccerLineup.Model
{
    public class Team
    {
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