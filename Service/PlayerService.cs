using Newtonsoft.Json;
using System.IO;
using Lineup.Coach.Model;

namespace Lineup.Coach.Service
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