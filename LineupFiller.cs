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
            var playersInRound = players;
            int preferenceRank = players.Max(player => player.PositionPreferenceRank.Ranking.Count());
            int initialPlayerCount = playersInRound.Count;
            while (!theGame.AllGamePositionsFilled() && round < theGame.StartingPositionsPerPlayerCount)
            {
                for (int i = 0; i < initialPlayerCount; i++)
                {
                    if (playersInRound.Count > 0)
                    {
                        var player = getRandomPlayer(playersInRound);

                        for (int p = 0; p < preferenceRank; p++)
                        {
                            var positionName = player.GetPositionNameByPreferenceRank(preferenceRank);
                            var firstOpenMatch = theGame.GetFirstOpenPosition(positionName);

                            if (firstOpenMatch == null)
                            {
                                    Console.WriteLine($"No match for {positionName} but we can try the next ranked position for {player.FirstName}");
                                if(p == preferenceRank - 1)
                                {
                                    var openBench = theGame.GetFirstOpenBench();
                                    openBench.StartingPlayer = player;
                                }
                                p++;
                                    continue;
                            }
                            else
                            {
                                var periodWithFirstOpenMatch = theGame.GetPeriodById(firstOpenMatch.PeriodId);
                                var playerStartingThisPeriod = periodWithFirstOpenMatch.Positions
                                    .Any(position => player.StartingPositions.Contains(position.Id));
                                if (!playerStartingThisPeriod)
                                {
                                    firstOpenMatch.StartingPlayer = player;
                                    // probably redundant
                                    player.StartingPositions.Add(firstOpenMatch.Id);
                                    playersInRound.Remove(player);
                                }

                            }
                        }

                    }
                }
                round++;
                playersInRound = players;
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