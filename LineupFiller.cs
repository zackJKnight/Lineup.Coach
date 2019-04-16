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
            //Rounds - within the rounds the players (in random order) are placed based on preference.
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

        }

        public void FillRemainingPositions(Game theGame, List<Player> players)
        {
            var unBenchedPlayers = players
                .Where(player => player.Benches.Count <= theGame.Periods.Count() - theGame.StartingPositionsPerPlayerCount)
                .OrderBy(player => player.Benches.Count);
            bool success = TryBenchPlayers(theGame, unBenchedPlayers.ToList());

            var placeThesePlayers = theGame.GetUnPlacedPlayers(players)
                .OrderBy(player => player.PlacementScore);

            var openPositions = theGame.GetOpenPositions();
            if (openPositions.Any())
            {
                foreach (var lowScorePlayer in placeThesePlayers)
                {
                    TryPlacePlayer(theGame, placeThesePlayers.ToList(), lowScorePlayer, openPositions);
                }
            }
            
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
                    if (!playerStartingThisPeriod && OpenMatchingPosition.StartingPlayer == null)
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
                        player.PlacementScore = player.PlacementScore - 1;
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