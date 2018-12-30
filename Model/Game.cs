using System;
using System.Collections.Generic;
using System.Linq;

namespace YouthSoccerLineup.Model
{
    public class Game : IGame
    {
        private DateTime _playDate;
        private double _startingPositionPerPlayerCount;

        public DateTime PlayDate { get => _playDate; set => _playDate = value; }
        public List<Period> Periods { get; set; }
        public int MaxNumberOfPlayers { get; set; }
        public Team Opponent { get; set; }
        public bool IsHomeGame { get; set; }
        public string RefereeName { get; set; }

        /// <summary>
        /// The number of times each player can start in the Game
        /// </summary>
        public double StartingPositionPerPlayerCount
        {
            get => _startingPositionPerPlayerCount;
            set => _startingPositionPerPlayerCount = value;
        }

        /// <summary>
        /// The date on which the Game occurs.
        /// </summary>
        /// <param name="playDate"></param>
        public Game(DateTime playDate)
        {
            this.PlayDate = playDate;
            this.Periods = new List<Period>();
        }

        public Position GetFirstOpenBench()
        {
            return this.Periods
                .OrderBy(period => period.Number)
                .SelectMany(period => period.Positions)
                .Where(position => position.Name.ToLower() == "bench")
                .FirstOrDefault();
        }
        public Position GetFirstOpenPosition(string name)
        {
            // TODO Structure this to prevent returning an empty position.  
            Position firstOpenMatch = new Position("", Guid.NewGuid());
            try
            {
                firstOpenMatch = this.Periods
                    .OrderBy(period => period.Number)
                    .Where(period => !period.NonBenchPositionsAreFilled())
                    .SelectMany(period => period.Positions
                    .Where(position => position.Name.ToLower() != "bench")
                    .Where(position => position.Name.ToLower() == name && position.StartingPlayer == null))
                    .FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return firstOpenMatch;
        }

        public Period GetPeriodById(Guid id)
        {
            return this.Periods.Where(period => period.Id == id).FirstOrDefault();
        }

        public void SetGamePositions(string[] preferredPositionNames, int benchCount)
        {

            int positionInstanceCount = 2;

            for (int i = 0; i < positionInstanceCount; i++)
            {
                preferredPositionNames
                .Where(position => position != "goalie").ToList()
                .ForEach(position => this.Periods.ToList()
                .ForEach(period => period.Positions.Add(new Position(position, period.Id))));
            }

            for (int i = 0; i < benchCount; i++)
            {
                this.Periods.ToList()
                .ForEach(period => period.Positions.Add(new Position("bench", period.Id)));
            }

        }

        public bool AllGamePositionsFilled()
        {
            return this.Periods.SelectMany(period => period.Positions).All(position => position.StartingPlayer != null);
        }
    }
}