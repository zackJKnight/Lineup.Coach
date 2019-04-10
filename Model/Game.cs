using System;
using System.Collections.Generic;
using System.Linq;

namespace Lineup.Coach.Model
{
    public class Game : IGame
    {
        private DateTime _playDate;
        private double _startingPositionPerPlayerCount;
        private int _benchCount;

        public DateTime PlayDate { get => _playDate; set => _playDate = value; }
        public List<Period> Periods { get; set; }
        public int BenchCount { get => _benchCount; set => _benchCount = value; }
        public int MaxPlayersOnFieldCount { get; set; }
        public int AvailablePlayerCount { get; set; }
        public Team Opponent { get; set; }
        public bool IsHomeGame { get; set; }
        public string RefereeName { get; set; }

        /// <summary>
        /// The number of times each player can start in the Game
        /// </summary>
        public double StartingPositionsPerPlayerCount
        {
            get => _startingPositionPerPlayerCount;
            set => _startingPositionPerPlayerCount = value;
        }

        /// <summary>
        /// The date on which the Game occurs.
        /// </summary>
        /// <param name="playDate"></param>
        public Game(DateTime playDate, int availablePlayerCount, int maxNumberOfPlayersOnField)
        {
            this.PlayDate = playDate;
            this.Periods = new List<Period>();
            this.AvailablePlayerCount = availablePlayerCount;
            this.MaxPlayersOnFieldCount = maxNumberOfPlayersOnField;
            BenchCount = AvailablePlayerCount - MaxPlayersOnFieldCount;
            BenchCount = BenchCount < 0 ? 0 : BenchCount;
            this.StartingPositionsPerPlayerCount = SetStartingPositionsPerPlayerCount();
        }

        public Position GetFirstOpenBench()
        {
            return this.Periods
                .OrderBy(period => period.Number)
                .SelectMany(period => period.Positions)
                .Where(position => position.PositionType == PositionType.Bench)
                .FirstOrDefault();
        }

        public IEnumerable<Position> GetOpenBenches()
        {
            return this.Periods
                .OrderBy(period => period.Number)
                .SelectMany(period => period.Positions)
                .Where(position => position.PositionType == PositionType.Bench)
                .Where(position => position.StartingPlayer == null);
        }

        public IEnumerable<Position> GetOpenBenchesByPeriod(Guid periodId)
        {
            return this.Periods
                .Where(period => period.Id == periodId)
                .SelectMany(period => period.Positions)
                .Where(position => position.PositionType == PositionType.Bench)
                .Where(position => position.StartingPlayer == null);
        }

        public IEnumerable<Position> GetFilledBenchesByPeriod(Guid periodId)
        {
            return this.Periods
                .Where(period => period.Id == periodId)
                .SelectMany(period => period.Positions)
                .Where(position => position.PositionType == PositionType.Bench)
                .Where(position => position.StartingPlayer != null);
        }

        public Position GetFirstOpenPositionByName(string name)
        {
            // TODO Structure this to prevent returning an empty position.
            Position firstOpenMatch = null;
            try
            {
                firstOpenMatch = this.Periods
                    .OrderBy(period => period.Number)
                    .SelectMany(period => period.Positions
                    .Where(position => position.Name.ToLower() == name && position.StartingPlayer == null))
                    .FirstOrDefault();
            }
            catch (Exception ex)

            {
                throw ex;
            }
            if(firstOpenMatch == null)
            {
                firstOpenMatch = new Position("", Guid.NewGuid());
            }
            return firstOpenMatch;
        }
        public List<Position> GetOpenPositions()
        {
            List<Position> openPositions = new List<Position>();
            try
            {
                openPositions = this.Periods
                    .OrderBy(period => period.Number)
                    .SelectMany(period => period.Positions
                    .Where(position => position.PositionType != PositionType.Bench)
                    .Where(position => position.StartingPlayer == null)).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return openPositions;
        }

        public List<Position> GetOpenPositionsByName(string name)
        {
            List<Position> openMatches = new List<Position>();
            try
            {
                openMatches = this.Periods
                    .OrderBy(period => period.Number)
                    .SelectMany(period => period.Positions
                    .Where(position => position.PositionType != PositionType.Bench)
                    .Where(position => position.Name.ToLower() == name && position.StartingPlayer == null)).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return openMatches;
        }

        public Period GetPeriodById(Guid id)
        {
            return this.Periods.Where(period => period.Id == id).FirstOrDefault();
        }

        public IEnumerable<Period> GetPeriodsWithOpenPositions()
        {
            return this.Periods.Where(per => per.Positions
            .Any(pos => pos.StartingPlayer == null && pos.PositionType != PositionType.Bench));
        }

        public IEnumerable<Player> GetUnPlacedPlayers(List<Player> players)
        {
            return players.Where(player => player.StartingPositions.Count >= StartingPositionsPerPlayerCount);
        }
        public void SetGamePositions(string[] preferredPositionNames)
        {
            int positionInstanceCount = 2;

            for (int i = 0; i < positionInstanceCount; i++)
            {
                preferredPositionNames
                .Where(position => position != "goalie").ToList()
                .ForEach(position => this.Periods.ToList()
                .ForEach(period => period.Positions.Add(new Position(position, period.Id))));
            }

            for (int i = 0; i < BenchCount; i++)
            {
                this.Periods.ToList()
                .ForEach(period => period.Positions.Add(new Position("bench", period.Id, PositionType.Bench)));
            }
        }

        public int SetStartingPositionsPerPlayerCount()
        {
            return (int)this.MaxPlayersOnFieldCount * this.Periods.Count / AvailablePlayerCount;

        }

        public bool AllGamePositionsFilled()
        {
            return this.Periods.SelectMany(period => period.Positions).All(position => position.StartingPlayer != null);
        }
    }
}