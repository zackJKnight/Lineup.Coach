using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineupTests.Model
{
    [TestClass]
    public class GameTests
    {
        private MockRepository mockRepository;

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
            return new Game(
                playDate,
                7,
                10);
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