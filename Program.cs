using System;
using System.Linq;
using Lineup.Coach.Model;
using Lineup.Coach.Service;

namespace Lineup.Coach
{
    internal class Program
    {
        private static string PLAYER_DATA_FILE = "./LineupDataPositionRankingByArrayOrder.json"; // "./u8Lineup.data.json";
        private static DateTime GamePlayDate = DateTime.Now.AddDays(5);
        private static string TEAM_NAME = "The Green Machine";
        private static int NumberOfPeriods = 4;
        private static int PERIOD_DURATION = 15;
        private static int MAX_NUMBER_OF_PLAYERS = 7;

        private static void Main(string[] args)
        {
            var playerService = new PlayerService();
            var lineupfiller = new LineupFiller();
            var PlayerInfo = playerService.GetPlayerData(PLAYER_DATA_FILE);
            var TheTeam = new Team(TEAM_NAME);
            PlayerInfo.Players.ToList().ForEach(player => TheTeam.Roster.Add(player));
            var TheGame = new Game(GamePlayDate, TheTeam.Roster.Count, MAX_NUMBER_OF_PLAYERS);

            for (int i = 0; i < NumberOfPeriods; i++)
            {
                TheGame.Periods.Add(new Period(i + 1, PERIOD_DURATION));
            }
            var distinctPositionNames = PlayerInfo.Players
                .SelectMany(player => player.PositionPreferenceRank.Ranking).Distinct().ToArray();
            TheGame.SetGamePositions(distinctPositionNames);
            TheGame.StartingPositionsPerPlayerCount = TheGame.SetStartingPositionsPerPlayerCount();

            lineupfiller.FillLineupByPlayerPreference(TheGame, TheTeam.Roster);

            if (!TheGame.AllGamePositionsFilled())
            {
                lineupfiller.FillRemainingPositions(TheGame, TheTeam.Roster);
            }

            LineupWriter.WriteLineup(TheGame);

            Console.ReadKey();
        }
    }
}