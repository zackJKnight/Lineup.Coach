using System;
using System.Collections.Generic;

namespace Lineup.Coach.Model
{
    public interface IGame
    {
        bool IsHomeGame { get; set; }
        int MaxPlayersOnFieldCount { get; set; }
        Team Opponent { get; set; }
        List<Period> Periods { get; set; }
        DateTime PlayDate { get; set; }
        string RefereeName { get; set; }
    }
}