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
            var playersInRound = players;
            int preferenceRank = players.Max(player => player.PositionPreferenceRank.Ranking.Count());
            int initialPlayerCount = playersInRound.Count;
            // this thing will go forever because: we may have filled a position, but a subsequent fill
            // caused the previous filling to make the rest of the game impossible to fill
            // so we need some way to check that. and then move the player to a position that better 
            // suits the conditions of the team and game.

            while (!theGame.AllGamePositionsFilled() && round < theGame.StartingPositionsPerPlayerCount)
            {
                for (int i = 0; i < initialPlayerCount; i++)
                {
                    if (playersInRound.Count > 0)
                    {
                        var player = getRandomPlayer(playersInRound);
                        // Likely there will be a remainder.
                        if (player.StartingPositions.Count < theGame.StartingPositionsPerPlayerCount)
                        {
                            for (int p = 1; p < preferenceRank; p++)
                            {
                                var positionName = player.GetPositionNameByPreferenceRank(p);
                                if (!string.IsNullOrEmpty(positionName))
                                {
                                    // instead get all open matching positions.
                                    var OpenMatchingPositions = theGame.GetOpenPositionsByName(positionName);

                                    if (!OpenMatchingPositions.Any())
                                    {
                                        Console.WriteLine($"No match for {positionName} but we can try the next ranked position for {player.FirstName}");
                                        //var goalies = theGame.Periods.SelectMany(per => per.Positions.Where(po => po.Name.ToLower() == "goalie")).Select(pos => pos.StartingPlayer.FirstName).ToList();
                                        
                                        p++;
                                        continue;
                                    }
                                    else
                                    {
                                        foreach (var OpenMatchingPosition in OpenMatchingPositions)
                                        {
                                            var periodWithFirstOpenMatch = theGame.GetPeriodById(OpenMatchingPosition.PeriodId);
                                            var playerStartingThisPeriod = periodWithFirstOpenMatch.Positions
                                                .Any(position => player.StartingPositions.Contains(position.Id));
                                            if (!playerStartingThisPeriod)
                                            {
                                                OpenMatchingPosition.StartingPlayer = player;
                                                // probably redundant
                                                player.StartingPositions.Add(OpenMatchingPosition.Id);
                                                playersInRound.Remove(player);
                                                break;
                                            }
                                            else
                                            {
                                                //player is already starting this period. we want to put him in the next matching position.
                                                continue;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            var openBench = theGame.GetFirstOpenBench();
                            openBench.StartingPlayer = player;
                        }
                    }
                }
                round++;
                playersInRound = players;
            }

            if(!theGame.AllGamePositionsFilled())
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