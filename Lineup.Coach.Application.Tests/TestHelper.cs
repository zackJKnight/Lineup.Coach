using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Lineup.Coach.Application;
using Lineup.Coach.Domain;

namespace Lineup.Coach.Application.Tests
{
    public static class TestHelper
    {
        private const int POSITION_NAMES_COUNT = 4;
        private const int ARBITRARY_RANDOM_STRING_LENGTH_LIMIT = 14;
        private const int playersOnField = 7;
        private const int periodDuration = 20;
        private static string[] standardLineupPositions;


        private static Random Random => new Random();

        public static string[] StandardLineupPositions { get => standardLineupPositions ?? new string[] {
                "goalie",
            "defense",
            "defense",
            "mid",
            "mid",
            "forward",
            "forward",
        }; set => standardLineupPositions = value; }

        public static Game CreateGame(int positionsPerPeriodCount, string[] positionList, int playersOnTeam)
        {

            var playDate = DateTime.Now;
            var TestGame = new Game();
            TestGame.SetGameOptions(playDate,
                playersOnTeam,
                playersOnField);

            var Periods = new List<Period>()
            {
                new Period(1, periodDuration),
                new Period(2, periodDuration),
                new Period(3, periodDuration),
                new Period(4, periodDuration)
            };
            TestGame.Periods = Periods;
            TestGame.Periods.ForEach(period =>
            period.Positions = CreatePositions(positionsPerPeriodCount, positionList, period.Id));
            TestGame.StartingPositionsPerPlayerCount = TestGame.SetStartingPositionsPerPlayerCount();
            return TestGame;
        }
        public static Player CreatePlayer()
        {
            string name = GetRandomString();
            var ranking = Enum.GetNames(typeof(PositionNames)).ToList();
            ranking.Remove("Bench");
            Shuffle(ranking);
      
            var half = name.Length / 2;
            return new Player(name.Substring(0, half), name.Substring(name.Length - half, half), ranking.ToArray());
        }

        private static List<Position> CreatePositions(int positionCount, string[] positionList, Guid periodId)
        {
            if (positionList.Length > 0)
            {

                var givenList = new List<Position>();
                foreach (var positionName in positionList)
                {
                    givenList.Add(new Position(positionName, periodId));

                }

                return givenList;
            }
            else
            {
                positionCount = positionCount == 0 ? playersOnField : positionCount;

                var generatedList = new List<Position>();
                for (int i = 0; i < positionCount; i++)
                {
                    generatedList.Add(new Position(TestHelper.GetRandomString(), Guid.NewGuid()));
                }

                return generatedList;
            }
        }


        public static string GetRandomString()
        {
            string randomString = string.Empty;
            int length = Random.Next(ARBITRARY_RANDOM_STRING_LENGTH_LIMIT);
            for (int i = 0; i < length; i++)
            {

                int latinAlphabetCharCount = 26;
                int latinAlphabetUpperCaseStartingChar = 65;
                // Add a random character to the string. Thank you, C# corner.                
                randomString = $"{randomString}{Convert.ToChar(Convert.ToInt32(Math.Floor(latinAlphabetCharCount * Random.NextDouble() + latinAlphabetUpperCaseStartingChar)))}";
            }
            return randomString;

        }
        private static void Shuffle<T>(this IList<T> list)
        {
            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = Random.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        }
    }

}
