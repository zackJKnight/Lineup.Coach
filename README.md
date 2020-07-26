# Fill a Game Lineup for the New Youth Coach

![CI Badge](https://img.shields.io/azure-devops/build/zacharyknight/ce6418bd-131f-4ad6-b014-b24d45714fde/6.svg?label=Azure%20Devops&style=flat) ![Test Badge](https://img.shields.io/azure-devops/tests/zacharyknight/Lineup.Coach/6.svg?style=flat)

Code in progress to aid my thinking about filling a lineup for a game of youth soccer.

## TODO

- [ ] not filling last period
- [x] players are being placed and not removed. the stack doesn't go backward if it can't place. need to undo the previous decision when all tries are exhasted.
- [x] ensure player starting? functions use positions on stack in progress and not default
- [x] make benches back into first rate positions
- [ ] add to check that player hasn't exceeded max bench count
- [ ] handle players not present - generate number of benches dynamically.
- [ ] handle not enough players to fill the game - consider the idea of a blank placeholder

## Terminology

Placement Score - a number of points that represents the player's current starting positions in relation to placement decision factors, e.g., player's preference.

Fit score = Suitability score. The player's suitability for a given position. Composed of (values are spitball at this point):

     - Placed this period? false = 1; true = -1 ***update - also just preventing placement of an already placed player is required. it must be done. You can never place a player that's alredy placed; if you find yourself in that situation, it's time to recurse back to a time when the player was not placed. maybe just pop that player off of the position's starters stack instead of the entire game placement... not sure.
     - Player's preference rank of position: range 0-n (where n equals number of positions) (might bench be the lowest rank in each player's pref ranking, or should it have some negative value?)
     - Distance from ideal placement count. e.g. if each player gets 3 starts in the game and this position makes the player's 2nd start. Score accordingly.
     - Placement score in relation to all other placement scores (if a player gets his preference all game and another doesn't get a single preffered position, this point will balance)

## What I've Learned So Far

Looping through players and trying to place ends up with cases where you would want to remove players already placed. Going through this taught me that you need a way to check all previous placements for fit each time you make a placement.. maybe.

This point may have come about on a false premise (but it's true if you loop through players and try to place): After trying to loop through periods, and positions within; it's better to zoom out and attempt placement across all game positions.

### Recursive Backtracking Algorithm

After some failure and some research, I'm trying backtracking. I think flattening positions and pushing them on to a stack when filled could work; however, I'd have to pop all the way back to the first position in some cases.

To try; score each position's fitness for the player. The score changes the moment a player is placed. Each position has an array of player's Fit score.
     - Sort this array ascending for each position in period 1.
     - Place, check and unplace, repeat.
     - When period 1 is sorted, try it in period 2 and then re-balance period 1.

Bench is just another position, but its score reflects that it is a bench.

## Missing Concepts

Placing by player preference alone leaves out the fact that the Game has needs that aren't always met by the player's prefs.

- [x] We know how many positions each player can start in.

- [ ] Determine bench count per game. How many times will each player sit?

- [x] When a player starts in the number of positions the game can afford, we can skip to a player that isn't fulfilled.

- [ ] How about counting the number of preferred positions and determining which will get filled first/neglected?

- [x] Rounds: looping the player list in random order the first round.

     -- A note from the future; when we know placements will be unbalanced, we don't need to randomize

- [x] Implement the player placement score: At some point the order may be that players that did not get their preference go to the top of the round.

If inside the round we find that no more preferred positions are available... what do we do?

- [x] Try to put the player in the next postion down the ranking

- [x] Do we need to know how many times each player can start in its favorite position?

- [x] We should look at the number of times each player can start in a game.

- [ ] Count the number of favorited positions vs available in the game.

## Feature Ideas

- Abstract for use in other sports

- Add ability to pick from list of positions and formations for multiple instances of the same position on the pitch or create your own.

- Goalie is added by default for local U8, but need to consider broader use

## Old Notes

Can we know how many times a player will sit the bench? numbers we'd need: roster player count. game period count. period starting player
