using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace YouthSoccerLineup.Model
{
    [JsonObject]
    public class Player
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<Guid> StartingPositions { get; set; }
        public PositionPreferenceRank PositionPreferenceRank { get; set; }

        public Player()
        {
            this.StartingPositions = new List<Guid>();
        }

        public string GetFavoritePositionName()
        {
            return this.PositionPreferenceRank.Ranking[0];
        }

        public string GetPositionNameByPreferenceRank(int rank)
        {
            string result = string.Empty;
            if (rank > 0 && this.PositionPreferenceRank != null && rank <= this.PositionPreferenceRank.Ranking.Length)
            {
                result = this.PositionPreferenceRank.Ranking[rank - 1];
            }
            return result;
        }
    }
}