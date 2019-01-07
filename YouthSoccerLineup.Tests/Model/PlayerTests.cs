using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineupTests.Model
{
    [TestClass]
    public class PlayerTests
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

        private Player CreatePlayer()
        {
            return new Player();
        }

        [TestMethod]
        public void GetFavoritePositionName_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var unitUnderTest = this.CreatePlayer();

            // Act
            var result = unitUnderTest.GetFavoritePositionName();

            // Assert
            Assert.Fail();
        }

        [TestMethod]
        public void GetPositionNameByPreferenceRank_ShouldReturnPositionNameInGivenRank()
        {
            // Arrange
            var unitUnderTest = this.CreatePlayer();
            int rank = 2;

            unitUnderTest.PositionPreferenceRank = new Mock<PositionPreferenceRank>().Object;
            unitUnderTest.PositionPreferenceRank.Ranking = new string[] { "first", "second", "third" };

            // Act
            var result = unitUnderTest.GetPositionNameByPreferenceRank(
                rank);

            // Assert
            Assert.IsTrue(result == "second", "Player Position Preference rank of 2 should return a position name of \"second\".");
        }
    }
}