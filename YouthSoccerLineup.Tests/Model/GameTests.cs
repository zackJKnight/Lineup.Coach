using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineupTests.Model
{
    [TestClass]
    public class GameTests
    {
        private MockRepository mockRepository;
        private const int playersOnTeam = 10;
        private const int playersOnField = 7;
        private const int periodDuration = 20;
        private readonly string[] standardLineupPositions = { "goalie",
            "defense",
            "defense",
            "mid",
            "mid",
            "forward",
            "forward",
        };

        [TestInitialize]
        public void TestInitialize()
        {
            this.mockRepository = new MockRepository(MockBehavior.Strict);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            this.mockRepository.VerifyAll();
        }

        private Game CreateGame(int positionCount, string[] positionList)
        {

            var playDate = DateTime.Now;
            var TestGame = new Game(
                playDate,
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
            period.Positions = CreatePositions(positionCount, positionList));

            return TestGame;
        }

        private List<Position> CreatePositions(int positionCount, string[] positionList)
        {
            if (positionList.Length > 0)
            {

                var givenList = new List<Position>();
                foreach (var positionName in positionList)
                {
                    givenList.Add(new Position(positionName, Guid.NewGuid()));

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

        private Team CreateTeam()
        {
            var TestTeam = new Team("NameOfTestTeam");
            var Players = new List<Player>();
            for (int i = 0; i < playersOnTeam; i++)
            {
                Players.Add(TestHelper.CreatePlayer());
            }
            TestTeam.Roster = Players;
            return TestTeam;
        }

        [TestMethod]
        public void AskTheGame_CanYouPlaceAllPlayersOnceBasedOnPreference()
        {
            var unitUnderTest = this.CreateGame(0, standardLineupPositions);
            // declare my team's needs; number of players and their position prefs
            var testTeam = this.CreateTeam();
            var teamsFavoritePositions = testTeam.Roster.Select(player => player.PositionPreferenceRank)
                .Select(pref => pref.Ranking[0].ToLower());
            // Ask the game whether it has a position for each of the team's players in their fav. pos.
            var availableGamePositionNames = unitUnderTest.Periods.SelectMany(period => period.Positions)
                .Select(position => position.Name);
            var unmetFavoritePositions = availableGamePositionNames.Except(teamsFavoritePositions);
            Assert.IsFalse(unmetFavoritePositions.Any(), "There were unmet positions.");

            // but the question that remains is: do these fit within the periods. I guess it is good to first find out if it even fits within the game.
        }

        [TestMethod]
        public void GetFirstOpenPosition_StateUnderTest_ExpectedBehavior()
        {
            string expectedName = "defense";

            // Arrange
            var unitUnderTest = this.CreateGame(0, new[]{
                expectedName });

            // Act
            var result = unitUnderTest.GetFirstOpenPosition(expectedName);

            // Assert
            Assert.AreEqual(result.Name, expectedName, "Expected open position not returned.");
        }

        [TestMethod]
        public void SetGamePositions_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var unitUnderTest = this.CreateGame(0,
                new[] {
                    "bench"
                    });
            string[] preferredPositionNames = new string[] { "defense", "forward" };

            Assert.IsFalse(unitUnderTest.Periods.SelectMany(period => period.Positions)
                .Where(position => position.Name == "defense").Any());
            // Act
            unitUnderTest.SetGamePositions(
                preferredPositionNames);

            // Assert
            Assert.IsTrue(unitUnderTest.Periods.SelectMany(period => period.Positions)
                .Where(position => position.Name == "defense").Any());
        }
    }
}