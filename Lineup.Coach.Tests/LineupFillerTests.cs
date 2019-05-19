using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Lineup.Coach.Domain;
using Lineup.Coach.Application;

namespace Lineup.Coach.Tests
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
            for (int i = 0; i < 15; i++)
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
            string[] ranking = TestHelper.StandardLineupPositions.OrderBy(x => random.Next()).ToArray();
            player.Object.PositionPreferenceRank = new PositionPreferenceRank(ranking);
            return player.Object;
        }

        [TestMethod]
        public void FillByPlayerPreference_ShouldNotLeaveOpenPositions()
        {
            // Arrange
            var unitUnderTest = CreateLineupFiller();
            var testGame = TestHelper.CreateGame(10, TestHelper.StandardLineupPositions, 7);
            // Act
            unitUnderTest.FillLineupByPlayerPreference(testGame, mockTeam.Object.Roster);

            var actualPositionName = testGame.Periods
                .SelectMany(period => period.Positions
                .Select(position => position.Name)).FirstOrDefault();
            var shouldNotBeAnOpenPosition = testGame.GetFirstOpenPositionByName(actualPositionName.ToString()).Name;
            Assert.AreEqual(string.Empty, shouldNotBeAnOpenPosition, "There should not be an open position, but there was.");
        }

        [TestMethod]
        public void ShouldNotBenchWhenPlayerStartsThisPeriod()
        {
            var unitUnderTest = CreateLineupFiller();
            var testGame = TestHelper.CreateGame(10, TestHelper.StandardLineupPositions, 7);
            for (int i = 0; i < 2; i++)
            {
                testGame.Periods.ForEach(period => period.Positions.Add(new Position("bench", period.Id, PositionType.Bench)));
            }
            unitUnderTest.FillLineupByPlayerPreference(testGame, mockTeam.Object.Roster);
            var periods = testGame.Periods;
            foreach (var period in periods)
            {
                var playersPlacedMoreThanOnceAPeriod = period.Positions
                    .GroupBy(position => position.StartingPlayer);
                Assert.IsFalse(playersPlacedMoreThanOnceAPeriod.Any(position => position.Count() > 1),
                    "A player cannot start and bench in the same period.");
            }
        }
    }
}