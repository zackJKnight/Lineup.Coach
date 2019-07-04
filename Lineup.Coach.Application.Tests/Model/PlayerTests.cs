using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using Lineup.Coach.Domain;

namespace Lineup.Coach.Application.Tests.Model
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


        [TestMethod]
        public void GetFavoritePositionName_StateUnderTest_ExpectedBehavior()
        {
            // Arrange
            var unitUnderTest = TestHelper.CreatePlayer();

            // Act
            var result = unitUnderTest.GetFavoritePositionName();

            // Assert
            Assert.IsFalse(string.IsNullOrEmpty(result));
        }

        [TestMethod]
        public void GetPositionNameByPreferenceRank_ShouldReturnPositionNameInGivenRank()
        {
            // Arrange
            var unitUnderTest = TestHelper.CreatePlayer();
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