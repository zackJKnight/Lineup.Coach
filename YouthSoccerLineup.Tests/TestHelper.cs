using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineupTests
{
    public static class TestHelper
    {
        public const int positionNamesCount = 4;

        public static Player CreatePlayer()
        {
            string name = string.Empty;
            Random random = new Random();
            var length = random.Next(14);
            for (int i = 0; i < length; i++)
            {
                // Thank you, C# corner.
                name = $"{name}{Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)))}";
            }

            //TODO shuffle this
            var ranking = Enum.GetNames(typeof(PositionNames)).ToList().OrderBy(positionName => positionName).ToArray();
      
            var half = name.Length / 2;
            return new Player(name.Substring(0, half), name.Substring(name.Length - half, half), ranking);
        }

    }

    private static void Shuffle()
    {
        int n =
    }
}
