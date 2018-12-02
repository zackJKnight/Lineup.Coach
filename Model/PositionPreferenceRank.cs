using Newtonsoft.Json;

namespace YouthSoccerLineup.Model
{
    [JsonObject]
    public class PositionPreferenceRank
    {
        public string goalie { get; set; }
        public string defense { get; set; }
        public string mid { get; set; }
        public string forward { get; set; }
        [JsonConstructor]
        public PositionPreferenceRank()
        {

        }
    }
}