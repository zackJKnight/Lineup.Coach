using System;

namespace YouthSoccerLineup.Model
{
    public class Position
    {
        public string Name { get; set; }
        public Guid PeriodId {get;set;}
        public Player StartingPlayer { get; set; }
        public Position(string name, Guid periodId)
        {
            this.Name = name;
            this.PeriodId = periodId;
        }
    }
}