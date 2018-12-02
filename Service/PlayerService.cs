using System.IO;
using System.Linq;
using Newtonsoft.Json;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineup.Service
{
    public class PlayerService
    {
        static RootObject PlayerInfo { get; set; }
        public RootObject GetPlayerData(string dataFile)
        {
            using (StreamReader reader = File.OpenText(dataFile))
            {
                string json = reader.ReadToEnd();
                return JsonConvert.DeserializeObject<RootObject>(json);
            }
        }

        void HoldMyScrapNotes()
        {
            var favoriteIsGoalie = PlayerInfo.Players.Where(player => player.PositionPreferenceRank.goalie == "1").ToList();
            var favoriteIsDefense = PlayerInfo.Players.Where(player => player.PositionPreferenceRank.defense == "1").ToList();
            var favoriteIsForward = PlayerInfo.Players.Where(player => player.PositionPreferenceRank.forward == "1").ToList();
            var favoriteIsMid = PlayerInfo.Players.Where(player => player.PositionPreferenceRank.mid == "1").ToList();
        }
    }
}