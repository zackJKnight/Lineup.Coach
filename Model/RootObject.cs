using Newtonsoft.Json;

namespace YouthSoccerLineup.Model
{
    public class RootObject
    {
        [JsonProperty(PropertyName = "Players")]
        public Player[] Players { get; set; }
    }
}