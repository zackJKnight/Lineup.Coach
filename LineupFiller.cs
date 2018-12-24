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
        public void FillLineupByPlayerPreference(Game theGame, List<Player> players)
        {
            int round = 0;
            int preferenceRank = 1;
            int initialPlayerCount = players.Count;
            for (int i = 0; i < initialPlayerCount; i++)
            {
                // Select player randomly.
                var player = getRandomPlayer(players);
                // Lesson learned: do not iterate the periods; step up to the whole Game
                // Find the first open match
                for (int p = 0; p < preferenceRank; p++)
                {
                    var positionName = player.GetPositionNameByPreferenceRank(preferenceRank);
                    var firstOpenMatch = theGame.GetFirstOpenPosition(positionName);

                    if (firstOpenMatch == null)
                    {
                        Console.WriteLine($"No open match for player: {player.FirstName} position name: {positionName}");
                        // We didn't find an open position at this rank of the player's preference. Go the next preferred position.

                        if (p == preferenceRank - 1)
                        {
                            Console.WriteLine($"Unable to place player: {player.FirstName} in round: {round}");
                            //you didn't find a position for this player. what will you do?
                            
                        }
                        else
                        {
                            p++;
                            continue;
                        }
                    }
                    else
                    {
                        // Place the player

                        firstOpenMatch.StartingPlayer = player;
                        players.Remove(player);
                        var periodWithFirstOpenMatch = theGame.GetPeriodById(firstOpenMatch.PeriodId);
                        if (periodWithFirstOpenMatch.NonBenchPositionsAreFilled())
                        {
                            tryBenchPlayer(periodWithFirstOpenMatch, player);
                        }
                        // Not getting to the next round because we aren't benching
                        round = (players.Count == 0) ? round++ : round;

                    }
                }
            }
        }


        private void tryBenchPlayer(Period period, Player player)
        {
           
                // is player in a position this period?
                var openBench = period.Positions
                    .Where(position => position.Name.ToLower() == "bench")
                    .FirstOrDefault();

                var playerNotStartingThisPeriod = (player.StartingPositions.Intersect(period.Positions
                    .Select(position => position.Id)));

                if (playerNotStartingThisPeriod.Any())
                {
                    openBench.SetStartingPlayer(player);
                }
        }
        private Player getRandomPlayer(List<Player> players)
        {
            var random = new Random();

            int randomIndex = random.Next(players.Count);

            return players[randomIndex];

        }
    }
}