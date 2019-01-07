using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace YouthSoccerLineup.Model
{
    [JsonObject]
    public class PositionPreferenceRank
    {
        public string[] Ranking { get; set; }

        [JsonConstructor]
        public PositionPreferenceRank()
        {
        }

        public PositionPreferenceRank(string[] ranking)
        {
            this.Ranking = ranking;
        }

        private Dictionary<int, string> getPositionRanking()
        {
            int rankNumber = 0;
            var rankingDictionary = new Dictionary<int, string>();
            foreach (string position in Ranking)
            {
                rankNumber = Array.FindIndex(Ranking, item => item == position);
                rankingDictionary.Add(rankNumber++, position);
            }
            return rankingDictionary;
        }
    }
}