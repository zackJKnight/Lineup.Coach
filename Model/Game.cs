using System;
using System.Collections.Generic;

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

    }
}