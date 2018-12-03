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
    }
}