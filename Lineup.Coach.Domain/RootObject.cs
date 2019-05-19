using Newtonsoft.Json;

namespace Lineup.Coach.Domain
{
    public class RootObject
    {
        [JsonProperty(PropertyName = "Players")]
        public Player[] Players { get; set; }
    }
}