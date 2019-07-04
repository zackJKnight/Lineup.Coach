using Newtonsoft.Json;
using System.IO;
using Lineup.Coach.Domain;
using System.Reflection;

namespace Lineup.Coach.Service
{
    public interface IPlayerService
    {
        RootObject GetPlayerData(string dataFile);
    }

    public class PlayerService : IPlayerService
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