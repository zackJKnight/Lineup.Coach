using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
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

        [TestInitialize]
        public void TestInitialize()
        {
            this.mockRepository = new MockRepository(MockBehavior.Strict);
            this.mockGame = new Mock<Game>();
            this.mockTeam = new Mock<Team>();
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

        [TestMethod]
        public void FillByPlayerPreference_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var unitUnderTest = CreateLineupFiller();

            // Act
            unitUnderTest.FillByPlayerPreference(this.mockGame.Object, mockTeam.Object.Roster);

            // Assert
            Assert.Fail();
        }
    }
}
