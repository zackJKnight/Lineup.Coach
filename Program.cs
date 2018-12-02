using System;
using System.Collections.Generic;
using System.Linq;
using YouthSoccerLineup.Model;
using YouthSoccerLineup.Service;

namespace YouthSoccerLineup
{
    internal class Program
    {
        private static string PLAYER_DATA_FILE = "./u8Lineup.data.json";
        private static DateTime GamePlayDate = DateTime.Now.AddDays(5);
        private static string TEAM_NAME = "The Green Machine";
        private static int NumberOfPeriods = 4;
        private static int PERIOD_DURATION = 15;
        private static int MAX_NUMBER_OF_PLAYERS = 7;

        private static void Main(string[] args)
        {
            var playerService = new PlayerService();
            var PlayerInfo = playerService.GetPlayerData(PLAYER_DATA_FILE);
            var TheTeam = new Team(TEAM_NAME);
            PlayerInfo.Players.ToList().ForEach(player => TheTeam.Roster.Add(player));
            var benchCount = TheTeam.Roster.Count - MAX_NUMBER_OF_PLAYERS;
            var TheGame = new Game(GamePlayDate);
            TheGame.MaxNumberOfPlayers = MAX_NUMBER_OF_PLAYERS;

            for (int i = 0; i < NumberOfPeriods; i++)
            {
                TheGame.Periods.Add(new Period(i + 1, PERIOD_DURATION));
            }
            List<Position> PositionList = new List<Position>();

            Type positionType = typeof(PositionPreferenceRank);
            var positionProperties = positionType.GetProperties();
            // TODO Add ability to pick from list of formations or create your own.
            // Add positions to each period
            int positionInstanceCount = 2;
            for (int i = 0; i < positionInstanceCount; i++)
            {
                positionProperties.Select(prop => prop.Name)
            .Where(position => position != "goalie").ToList()
            .ForEach(position => TheGame.Periods.ToList()
            .ForEach(period => period.Positions.Add(new Position(position))));
            }

            for (int i = 0; i < benchCount; i++)
            {
                TheGame.Periods.ToList()
                .ForEach(period => period.Positions.Add(new Position("bench")));
            }

            LineupWriter.WriteLineup(TheGame);

            Console.ReadKey();
        }
    }
}