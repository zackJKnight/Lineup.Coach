using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using YouthSoccerLineup;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineupTests
{
    [TestClass]
    public class LineupFillerTests
    {
        private MockRepository mockRepository;
        private Mock<Game> mockGame;
        private Mock<Team> mockTeam;
        private Mock<List<Player>> mockPlayerList;

        [TestInitialize]
        public void TestInitialize()
        {
            this.mockRepository = new MockRepository(MockBehavior.Strict);
            this.mockGame = new Mock<Game>(DateTime.Now);
            this.mockTeam = new Mock<Team>("TestTeamName");
            this.mockPlayerList = new Mock<List<Player>>();
            for (int i = 0; i < 10; i ++)
            {
                this.mockPlayerList.Object.Add(GenerateTestPlayer());
            }
            this.mockTeam.Object.Roster = this.mockPlayerList.Object;
        }

        [TestCleanup]
        public void TestCleanup()
        {
            this.mockRepository.VerifyAll();
        }

        private LineupFiller CreateLineupFiller()
        {
            return new LineupFiller();
        }

        private Player GenerateTestPlayer()
        {
            var player = new Mock<Player>();
            var random = new Random();
            var randomString = random.Next(5);
            player.Object.FirstName = $"testname-{randomString}";
            string[] ranking = new string[] { "posOne", "posTwo" };
            player.Object.PositionPreferenceRank = new PositionPreferenceRank(ranking);
            return player.Object;
        }

        [TestMethod]
        public void FillByPlayerPreference_ShouldNotLeaveOpenPositions()
        {
            // Arrange
            var unitUnderTest = CreateLineupFiller();

            // Act
            unitUnderTest.FillByPlayerPreference(this.mockGame.Object, mockTeam.Object.Roster);

            // Assert
            var actualPositionName = this.mockGame.Object.Periods
                .SelectMany(period => period.Positions
                .SelectMany(position => position.Name)).FirstOrDefault();
            var shouldNotBeAnOpenPosition = this.mockGame.Object.GetFirstOpenPosition(actualPositionName.ToString()).Name;
            Assert.AreEqual(string.Empty, shouldNotBeAnOpenPosition, "There should not be an open position, but there was.");
        }
    }
}
