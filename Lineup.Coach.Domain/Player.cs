using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lineup.Coach.Domain
{
    [JsonObject]
    public class Player
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [NotMapped]
        public List<Position> Benches { get; set; }
        [NotMapped]
        public List<Position> StartingPositions { get; set; }

        public int PlacementScore { get; set; }
        public PositionPreferenceRank PositionPreferenceRank { get; set; }

        public Player()
        {
            this.Benches = new List<Position>();
            this.StartingPositions = new List<Position>();
        }
        public Player(string firstName, string lastName, string[] ranking)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.PositionPreferenceRank = new PositionPreferenceRank(ranking);
        }

        public string GetFavoritePositionName()
        {
            return this.PositionPreferenceRank.Ranking[0];
        }

        public string GetPositionNameByPreferenceRank(int rank)
        {
            string result = string.Empty;
            if (rank > 0 && this.PositionPreferenceRank != null && rank <= this.PositionPreferenceRank.Ranking.Length)
            {
                result = this.PositionPreferenceRank.Ranking[rank - 1];
            }
            return result;
        }
    }
}