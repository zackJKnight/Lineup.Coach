using System;
using System.Linq;
using Lineup.Coach.Model;

namespace Lineup.Coach
{
    public static class LineupWriter
    {
        public static void WriteLineup(Game theGame)
        {
            theGame.Periods.ToList().ForEach(period =>
                {
                    Console.WriteLine($"{Environment.NewLine}Period {period.Number} Starting Players: ");
                    period.Positions.ForEach(position =>
                {
                    Console.WriteLine($"{position.Name.ToUpper()}: {(position.StartingPlayer != null ? position.StartingPlayer.FirstName : "No Player Set")}");
                });
                });
        }
    }
}