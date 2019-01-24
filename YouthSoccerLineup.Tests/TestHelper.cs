using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineupTests
{
    public static class TestHelper
    {
        private const int POSITION_NAMES_COUNT = 4;
        private const int ARBITRARY_RANDOM_STRING_LENGTH_LIMIT = 14;

        private static Random Random => new Random();
        public static Player CreatePlayer()
        {
            string name = GetRandomString();
            var ranking = Enum.GetNames(typeof(PositionNames)).ToList();
            ranking.Remove("Bench");
            Shuffle(ranking);
      
            var half = name.Length / 2;
            return new Player(name.Substring(0, half), name.Substring(name.Length - half, half), ranking.ToArray());
        }

        public static string GetRandomString()
        {
            string randomString = string.Empty;
            int length = Random.Next(ARBITRARY_RANDOM_STRING_LENGTH_LIMIT);
            for (int i = 0; i < length; i++)
            {

                int latinAlphabetCharCount = 26;
                int latinAlphabetUpperCaseStartingChar = 65;
                // Add a random character to the string. Thank you, C# corner.                
                randomString = $"{randomString}{Convert.ToChar(Convert.ToInt32(Math.Floor(latinAlphabetCharCount * Random.NextDouble() + latinAlphabetUpperCaseStartingChar)))}";
            }
            return randomString;

        }
        private static void Shuffle<T>(this IList<T> list)
        {
            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = Random.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }
        }
    }

}
