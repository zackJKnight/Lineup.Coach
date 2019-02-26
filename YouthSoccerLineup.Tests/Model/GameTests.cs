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
            var unitUnderTest = TestHelper.CreateGame(0, TestHelper.StandardLineupPositions, playersOnTeam);
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
            var unitUnderTest = TestHelper.CreateGame(0, new[]{
                expectedName }, playersOnTeam);

            // Act
            var result = unitUnderTest.GetFirstOpenPosition(expectedName);

            // Assert
            Assert.AreEqual(result.Name, expectedName, "Expected open position not returned.");
        }

        [TestMethod]
        public void SetGamePositions_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var unitUnderTest = TestHelper.CreateGame(0,
                new[] {
                    "bench"
                    }, playersOnTeam);
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