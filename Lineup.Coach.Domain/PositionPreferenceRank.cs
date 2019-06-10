using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Lineup.Coach.Domain
{
    [JsonObject]
    public class PositionPreferenceRank
    {
        public Guid Id { get; set; }
        public string[] Ranking { get; set; }

        [JsonConstructor]
        public PositionPreferenceRank()
        {
        }

        public PositionPreferenceRank(string[] ranking)
        {
            this.Ranking = ranking;
        }

        private Dictionary<int, string> GetPositionRanking()
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