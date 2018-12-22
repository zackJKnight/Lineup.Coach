using System;
using System.Collections.Generic;
using System.Linq;

namespace YouthSoccerLineup.Model
{
    public class Game : IGame
    {
        private DateTime _playDate;

        public DateTime PlayDate { get => _playDate; set => _playDate = value; }
        public List<Period> Periods { get; set; }
        public int MaxNumberOfPlayers { get; set; }
        public Team Opponent { get; set; }
        public bool IsHomeGame { get; set; }
        public string RefereeName { get; set; }
        public Game(DateTime playDate)
        {
            this.PlayDate = playDate;
            this.Periods = new List<Period>();
        }

        public Position GetFirstOpenPosition(string name)
        {
            // TODO Structure this to prevent returning this empty position.  
            Position firstOpenMatch = new Position("", Guid.NewGuid());
            try
            {
                firstOpenMatch = this.Periods.OrderBy(period => period.Number)
                    .SelectMany(period => period.Positions
                .Where(position => position.Name.ToLower() == name && position.StartingPlayer == null)).FirstOrDefault();
                
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Logging ain't free. Here's your exception message: {ex.Message}");
            }
            return firstOpenMatch;
        }

        public void SetGamePositions(string[] preferredPositionNames, int benchCount)
        {
            // TODO Add ability to pick from list of positions and formations 
            // for multiple instances of the same position on the pitch 
            // or create your own.

            int positionInstanceCount = 2;

            for (int i = 0; i < positionInstanceCount; i++)
            {
                // TODO goalie is added by default for local U8, but need to consider broader use
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
    }
}