using Newtonsoft.Json;

namespace Lineup.Coach.Model
{
    public class RootObject
    {
        [JsonProperty(PropertyName = "Players")]
        public Player[] Players { get; set; }
    }
}