using System.Collections.Generic;

namespace YouthSoccerLineup.Model {
    public class Period {
        public int Number {get; set;}
        public int DurationInMinutes {get;set;}
        public List<Position> Positions {get; set;}

        public Period(int number, int durationInMinutes)
        {
            this.Number = number;
            this.DurationInMinutes = durationInMinutes;
            this.Positions = new List<Position>();
            this.Positions.Add(new Position("goalie"));

        }
    }
}