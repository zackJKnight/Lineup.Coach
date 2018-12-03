using System;
using System.Collections.Generic;
using YouthSoccerLineup.Model;

namespace YouthSoccerLineup {
    public class LineupFiller {

        public LineupFiller()
        {

        }
        public void FillByPlayerPreference(Game theGame, List<Player> players) {
            // Get the player's favorite positions randomly
            var player = getRandomPlayer(players);
            // Lesson learned: do not iterate the periods; step up to the whole Game
            // Find the first open match from beginning to end of Game
            var firstOpenMatch = theGame.GetFirstOpenPosition(player.GetFavoritePositionName());
            // Place the player
            firstOpenMatch.StartingPlayer = player;
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