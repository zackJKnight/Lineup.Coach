using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace YouthSoccerLineup.Model
{
    [JsonObject]
    public class Player
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public PositionPreferenceRank PositionPreferenceRank { get; set; }
        public string GetFavoritePositionName()
        {
            return this.PositionPreferenceRank.Ranking[0];
        }
    }
}