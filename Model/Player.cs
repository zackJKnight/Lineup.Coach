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
        public Position GetFavoritePosition()
        {
            throw new NotImplementedException("You're still massaging the model");// new Position(this.PositionPreferenceRank);
        }
    }
}