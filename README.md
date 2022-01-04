# Fill a Game Lineup for the New Youth Coach

![CI Badge](https://img.shields.io/azure-devops/build/zacharyknight/ce6418bd-131f-4ad6-b014-b24d45714fde/6.svg?label=Azure%20Devops&style=flat) ![Test Badge](https://img.shields.io/azure-devops/tests/zacharyknight/Lineup.Coach/6.svg?style=flat)

Code in progress to aid my thinking about filling a lineup for a game of youth soccer.

The problem: for a team of players, fill a lineup for a game. A game can have a number of periods. A period can have a number of positions; including a number of bench positions. The first of many possible filling decisions is player position preference. Players define a preference order for positions in the period.

## Terminology

Placement Score - a number of points that represents the player's current starting positions in relation to placement decision factors, e.g., player's preference.

Fit score = Suitability score. The player's suitability for a given position. Composed of (values are spitball at this point):

     - Placed this period? false = 1; true = -1 ***update - preventing placement of an already placed player is required. it must be done. You can never place a player that's alredy placed; if you find yourself in that situation, it's time to recurse back to a time when the player was not placed. maybe just pop that player off of the position's starters stack instead of the entire game placement... not sure.
     - Player's preference rank of position: range 0-n (where n equals number of positions) (might bench be the lowest rank in each player's pref ranking, or should it have some negative value?)
     - Distance from ideal placement count. e.g. if each player gets 3 starts in the game and this position makes the player's 2nd start. Score accordingly.
     - Placement score in relation to all other placement scores (if a player gets his preference all game and another doesn't get a single preffered position, this point will balance)

### Recursive Backtracking Algorithm

After some failure and some research, I've attempted to solve the lineup with backtracking. I think flattening positions and pushing them on to a stack when filled could work; however, I'd have to pop all the way back to the first position in some cases.

To try; score each position's fitness for the player. The score changes the moment a player is placed. Each position has an array of player's Fit score.
     - Sort this array ascending for each position in period 1.
     - Place, check and unplace, repeat.
     - When period 1 is sorted, try it in period 2 and then re-balance period 1.

Bench is just another position, but its score reflects that it is a bench.

### Minimax Algorithm

Attempted minimax https://github.com/zackJKnight/Lineup-minimax-via-codingtrain/blob/969be805cf2e80701c676315151c38da04145e61/sketch.js with inspriation from Dan Shiffman (codingtrain on youtube). I think I shifted to another project before setting up the problem like a game with two players. This is probably a good approach, but I need to refine the rules of the game and try again. In it's current state, the benching conditions are not complete or implemented in a way that supports correctness.

## TODO

- [ ] distribution checks are failing. e.g. player is benched all game. or player gets 3 bench while another starts all game.
- [ ] bench placement score is the same as a non favorite score?
- [ ] hook up player choice drag and drop
- [ ] absent players are still showing up
- [ ] handle players not present - generate number of benches dynamically.
- [ ] handle not enough players to fill the game - consider the idea of a blank placeholder

## Missing Concepts

Placing by player preference alone leaves out the fact that the Game has needs that aren't always met by the player's prefs.

- [x] When a player starts in the number of positions the game can afford, we can skip to a player that isn't fulfilled.

- [ ] How about counting the number of preferred positions and determining which will get filled first/neglected?

- [x] Rounds: looping the player list in random order the first round.

     -- A note from the future; when we know placements will be unbalanced, we don't need to randomize

- [ ] Count the number of favorited positions vs available in the game.

## Feature Ideas

- Abstract for use in other sports

- Add ability to pick from list of positions and formations for multiple instances of the same position on the pitch or create your own.

- Goalie is added by default for local U8, but need to consider broader use
