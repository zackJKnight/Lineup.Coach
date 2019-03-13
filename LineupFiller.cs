using System;
using System.Collections.Generic;
using System.Linq;
using Lineup.Coach.Model;

namespace Lineup.Coach
{
    public class LineupFiller
    {
        public LineupFiller()
        {
        }

        public void FillLineupByPlayerPreference(Game theGame, List<Player> players)
        {
            int round = 0;
            var playersInRound = new List<Player>();
            playersInRound.AddRange(players);
            int preferenceRank = players.Max(player => player.PositionPreferenceRank.Ranking.Count());
            int initialPlayerCount = playersInRound.Count;

            while (!theGame.AllGamePositionsFilled() && round < (int)Math.Round(theGame.StartingPositionsPerPlayerCount) + 1)
            {
                for (int i = 0; i < initialPlayerCount; i++)
                {
                    if (playersInRound.Count > 0)
                    {
                        bool playerPlaced = false;

                        var player = getRandomPlayer(playersInRound);
                        for (int p = 1; p < preferenceRank; p++)
                        {
                            if (!playerPlaced)
                            {
                                var positionName = player.GetPositionNameByPreferenceRank(p);
                                if (!string.IsNullOrEmpty(positionName))
                                {
                                    var OpenMatchingPositions = theGame.GetOpenPositionsByName(positionName);

                                    if (!OpenMatchingPositions.Any())
                                    {
                                        if (p == preferenceRank - 1)
                                        {
                                            var openBenches = theGame.GetOpenBenches();
                                            foreach (var openBench in openBenches)
                                            {
                                                if (!theGame.GetPeriodById(openBench.PeriodId).IsPlayerStartingThisPeriod(player))
                                                {
                                                    openBench.StartingPlayer = player;
                                                    player.StartingPositions.Add(openBench.Id);
                                                    playerPlaced = true;
                                                    break;
                                                }
                                            }

                                        }
                                        else
                                        {
                                            Console.WriteLine($"No match for {positionName} but we can try the next ranked position for {player.FirstName}");
                                        }
                                        p++;

                                    }
                                    else
                                    {
                                        foreach (var OpenMatchingPosition in OpenMatchingPositions)
                                        {
                                            var periodWithFirstOpenMatch = theGame.GetPeriodById(OpenMatchingPosition.PeriodId);
                                            if (periodWithFirstOpenMatch != null)
                                            {
                                                var playerStartingThisPeriod = periodWithFirstOpenMatch.IsPlayerStartingThisPeriod(player);
                                                if (!playerStartingThisPeriod)
                                                {
                                                    OpenMatchingPosition.StartingPlayer = player;
                                                    player.StartingPositions.Add(OpenMatchingPosition.Id);
                                                    playersInRound.Remove(player);
                                                    playerPlaced = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                round++;
                playersInRound.AddRange(players);
            }

            if (!theGame.AllGamePositionsFilled())
            {
                // what's left and why?
                var openPositions = theGame.GetOpenPositions();
                // periods where the positions are full.  and find a player that has been assigned the
                // max number of positions. so they can only go to the bench.
                var periodsWithOpenPositions = theGame.GetPeriodsWithOpenPositions();
                periodsWithOpenPositions.ToList();
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