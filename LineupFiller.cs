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

            while (!theGame.AllGamePositionsFilled() && round < theGame.StartingPositionsPerPlayerCount + 1)
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
                                            List<Player> benchPlayers = new List<Player>();
                                            benchPlayers.Add(player);
                                            playerPlaced = TryBenchPlayers(theGame, benchPlayers);
                                        }
                                        else
                                        {
                                            Console.WriteLine($"No match for {positionName} but we can try the next ranked position for {player.FirstName}");
                                        }

                                    }
                                    else
                                    {
                                        playerPlaced = TryPlacePlayer(theGame, playersInRound, player, OpenMatchingPositions);
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
                FillRemainingPositions(theGame, players);
            }
        }

        private static void FillRemainingPositions(Game theGame, List<Player> players)
        {
            // what's left and why?
            var openPositions = theGame.GetOpenPositions();

            // grab players that have played the least and place them. this is where a placement score would help.


            var unBenchedPlayers = players.Where(player => player.Benches.Count == 0);
            bool success = TryBenchPlayers(theGame, unBenchedPlayers.ToList());
            var placeThesePlayers = theGame.GetUnPlacedPlayers(players);
            // periods where the positions are full.  and find a player that has been assigned the
            // max number of positions. so they can only go to the bench.
            var periodsWithOpenPositions = theGame.GetPeriodsWithOpenPositions();
            periodsWithOpenPositions.ToList();
        }

        private static bool TryPlacePlayer(Game theGame, List<Player> playersInRound, Player player, List<Position> OpenMatchingPositions)
        {
            bool playerPlaced = false;
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
                        player.PlacementScore += player.PositionPreferenceRank.Ranking.Length - Array.IndexOf(player.PositionPreferenceRank.Ranking, OpenMatchingPosition.Name.ToLower());
                        playersInRound.Remove(player);
                        playerPlaced = true;
                        break;
                    }
                }
            }

            return playerPlaced;
        }

        private static bool TryBenchPlayers(Game theGame, List<Player> players)
        {
            bool playerPlaced = false;
            var openBenches = theGame.GetOpenBenches();
            foreach (var player in players)
            {
                foreach (var openBench in openBenches)
                {
                    var currentPeriod = theGame.GetPeriodById(openBench.PeriodId);
                    if (!currentPeriod.IsPlayerBenchedThisPeriod(player) && !currentPeriod.IsPlayerStartingThisPeriod(player))
                    {
                        openBench.StartingPlayer = player;
                        player.Benches.Add(openBench.Id);
                        playerPlaced = true;
                        break;
                    }
                }
            }

            return playerPlaced;
        }

        private Player getRandomPlayer(List<Player> players)
        {
            var random = new Random();

            int randomIndex = random.Next(players.Count);

            return players[randomIndex];
        }
    }
}