using System;
using System.Linq;
using Lineup.Coach.Application;
using Lineup.Coach.Domain;
using Lineup.Coach.Service;

namespace Lineup.Coach.Application
{
    internal class Program
    {
        private static readonly string PLAYER_DATA_FILE_PATH = "2019TarHeels.json"; //"LineupDataPositionRankingByArrayOrder.json"; // "./u8Lineup.data.json";
        private static readonly DateTime GamePlayDate = DateTime.Now.AddDays(5);
        private static readonly string TEAM_NAME = "The Green Machine";
        private static readonly int NumberOfPeriods = 6;
        private static readonly int PERIOD_DURATION = 5;
        private static readonly int MAX_NUMBER_OF_PLAYERS = 5;

        private static void Main(string[] args)
        {
            if (args == null)
            {
                throw new ArgumentNullException(nameof(args));
            }

            var playerService = new PlayerService();
            var lineupfiller = new LineupFiller();
            var PlayerInfo = playerService.GetPlayerData(PLAYER_DATA_FILE_PATH);
            var TheTeam = new Team(TEAM_NAME);
            PlayerInfo.Players.ToList().ForEach(player => TheTeam.Roster.Add(player));
            var TheGame = new Game();
            TheGame.SetGameOptions(GamePlayDate, TheTeam.Roster.Count, MAX_NUMBER_OF_PLAYERS);

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

            LineupWriter.WriteLineupToConsole(TheGame);
            LineupWriter.WriteLineupToJson(TheGame);
            Console.ReadKey();
        }
    }
}