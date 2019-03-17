using System;
using System.Collections.Generic;
using System.Linq;

namespace Lineup.Coach.Model
{
    public class Period
    {
        public Guid Id { get; set; }
        public int Number { get; set; }
        public int DurationInMinutes { get; set; }
        public List<Position> Positions { get; set; }

        public Period(int number, int durationInMinutes)
        {
            this.Id = Guid.NewGuid();
            this.Number = number;
            this.DurationInMinutes = durationInMinutes;
            this.Positions = new List<Position>
            {
                new Position("goalie", this.Id)
            };
        }

        public bool NonBenchPositionsAreFilled()
        {
            return this.Positions
                .All(position => position.PositionType != PositionType.Bench && position.StartingPlayer != null);
        }

        public bool AllPeriodPositionsFilled()
        {
            return this.Positions.All(position => position.StartingPlayer != null);
        }

        public bool IsPlayerBenchedThisPeriod(Player player)
        {
            return this.Positions.Any(position => player.Benches.Contains(position.Id));
        }
        public bool IsPlayerStartingThisPeriod(Player player)
        {
            return this.Positions.Any(position => player.StartingPositions.Contains(position.Id));
        }

    }
}