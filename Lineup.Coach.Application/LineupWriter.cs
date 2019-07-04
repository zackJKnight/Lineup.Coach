using System;
using System.IO;
using System.Linq;
using Lineup.Coach.Domain;
using Newtonsoft.Json;

namespace Lineup.Coach.Application
{
    public static class LineupWriter
    {
        public static void WriteLineupToConsole(Game theGame)
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

        public static void WriteLineupToJson(Game theGame)
        {
            using (StreamWriter file = File.CreateText($@"C:\temp\GeneratedLineup{DateTime.Now.ToString("MMddyyyy")}.json"))
            {
                JsonSerializer serializer = new JsonSerializer();
                //serialize object directly into file stream
                serializer.Serialize(file, theGame);
            };
        }
    }
}