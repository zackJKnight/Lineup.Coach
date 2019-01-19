using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
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

        private Game CreateGame()
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
            period.Positions = new List<Position>()
            {
                new Position("forward", Guid.NewGuid()),
                new Position("forward", Guid.NewGuid()),
                new Position("mid", Guid.NewGuid()),
                new Position("mid", Guid.NewGuid()),
                new Position("defense", Guid.NewGuid()),
                new Position("defense", Guid.NewGuid()),
                new Position("bench", Guid.NewGuid()),
                new Position("bench", Guid.NewGuid()),
                new Position("bench", Guid.NewGuid())
            });

            return TestGame;
        }

        private Team CreateTeam()
        {
            var TestTeam = new Team("NameOfTestTeam");
            var Players = new List<Player>();
            for(int i = 0; i < playersOnTeam; i++)
            {
                Players.Add(TestHelper.CreatePlayer());
            }
            TestTeam.Roster = Players;
            return TestTeam;
        }

        [TestMethod]
        public void AskTheGame_CanYouPlaceAllPlayersBasedOnPreference()
        {
            var unitUnderTest = this.CreateGame();
            // declare my team's needs; number of players and their position prefs

            // Ask the game whether it has a position for each of the team's players in their fav. pos.
        }

        [TestMethod]
        public void GetFirstOpenPosition_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var unitUnderTest = this.CreateGame();
            string name = "defense";

            // Act
            var result = unitUnderTest.GetFirstOpenPosition(
                name);

            // Assert
            Assert.Fail();
        }

        [TestMethod]
        public void SetGamePositions_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var unitUnderTest = this.CreateGame();
            string[] preferredPositionNames = new string[] { "defense", "forward" };

            // Act
            unitUnderTest.SetGamePositions(
                preferredPositionNames);

            // Assert
            Assert.Fail();
        }
    }
}