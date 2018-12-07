using System;
using System.Collections.Generic;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineup
{
    public class LineupFiller
    {

        public LineupFiller()
        {

        }
        public void FillByPlayerPreference(Game theGame, List<Player> players)
        {
            // Select player randomly.
            var player = getRandomPlayer(players);
            // Lesson learned: do not iterate the periods; step up to the whole Game
            // Find the first open match
            var firstOpenMatch = theGame.GetFirstOpenPosition(player.GetFavoritePositionName());
            // Place the player
            if (firstOpenMatch != null)
            {
                firstOpenMatch.StartingPlayer = player;
            }
            // When you run out of open favorites, check the second and so on.
        }


        private Player getRandomPlayer(List<Player> players)
        {
            var random = new Random();

            int randomIndex = random.Next(players.Count);

            return players[randomIndex];

        }
    }
}