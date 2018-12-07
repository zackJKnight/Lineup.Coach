using System;
using System.Collections.Generic;
using System.Linq;
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
            int round = 0;
            bool positionsAllFilled = false;
            int preferenceRank = 1;

            // Select player randomly.
            var player = getRandomPlayer(players);
            // Lesson learned: do not iterate the periods; step up to the whole Game
            // Find the first open match
            var firstOpenMatch = theGame.GetFirstOpenPosition(player.GetPositionNameByPreferenceRank(preferenceRank));
            // Place the player
            if (firstOpenMatch == null)
            {

            }
            else{
                
                firstOpenMatch.StartingPlayer = player;
                players.Remove(player);
                round = (players.Count == 0) ? round++ : round;
                //TODO Start here. Library is closing now.
                positionsAllFilled = theGame.Periods.SelectMany(period => period.Positions
                .Where(position => position.StartingPlayer != null)).Any();
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