using Newtonsoft.Json;
using System.IO;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineup.Service
{
    public class PlayerService
    {
        private static RootObject PlayerInfo { get; set; }

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