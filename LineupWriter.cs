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
                    string placementScore = string.Empty;
                    string name = "No Player Set";
                    if (position.StartingPlayer != null)
                        {
                        name = position.StartingPlayer.FirstName;
                        placementScore = position.StartingPlayer.PlacementScore.ToString();
                    }

                    Console.WriteLine($"{position.Name.ToUpper()}: {name}         ---Placement Score: {placementScore}");
                });
                });
        }
    }
}