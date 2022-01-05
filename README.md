# Fill a Game Lineup for the New Youth Coach

![CI Badge](https://img.shields.io/azure-devops/build/zacharyknight/ce6418bd-131f-4ad6-b014-b24d45714fde/5.svg?label=Azure%20Devops&style=flat) ![Test Badge](https://img.shields.io/azure-devops/tests/zacharyknight/Lineup.Coach/5.svg?style=flat)

The problem: for a team of players, fill a lineup for a game. A game can have a number of periods. A period can have a number of positions; including a number of bench positions. The first of many possible filling decisions is player position preference. Players define a preference order for positions in the period.

## Terminology

Placement Score: a number of points that represents the player's current starting positions in relation to placement decision factors, e.g., player's preference.

Fit score or Suitability score: The player's suitability for a given position. Composed of (values are spitball at this point):

     - Placed this period? false = 1; true = -1 ***update - preventing placement of an already placed player is required. You can never place a player that's alredy placed; if you find yourself in that situation, it's time to recurse back to a time when the player was not placed. maybe just pop that player off of the position's starters stack instead of the entire game placement... not sure.
     - Player's preference rank of position: range 0-n (where n equals number of positions) (might bench be the lowest rank in each player's pref ranking, or should it have some negative value?)
     - Distance from ideal placement count. e.g. if each player gets 3 starts in the game and this position makes the player's 2nd start. Score accordingly.
     - Placement score in relation to all other placement scores (if a player gets his preference all game and another doesn't get a single preffered position, this point will balance)

- [x] We know how many positions each player can start in. 

After some failure and some research, I've attempted to solve the lineup with backtracking. I think flattening positions and pushing them on to a stack when filled could work; however, I'd have to pop all the way back to the first position in some cases.

- [ ] When a player starts in the number of positions the game can afford, we can skip to a player that isn't fulfilled.

- [ ] How about counting the number of preferred positions and determining which will get filled first/neglected?

### Minimax Algorithm

Attempted minimax https://github.com/zackJKnight/Lineup-minimax-via-codingtrain/blob/969be805cf2e80701c676315151c38da04145e61/sketch.js with inspriation from Dan Shiffman (codingtrain on youtube). I shifted to another project before setting up the problem like a game with two players. This is probably a good approach, but I need to refine the rules of the game and try again. In it's current state, the benching conditions are not complete or implemented in a way that supports correctness.

## TODO

- [ ] distribution checks are failing. e.g. player is benched all game. or player gets 3 bench while another starts all game.
- [ ] bench placement score is the same as a non favorite score?
- [ ] hook up player choice drag and drop
- [ ] absent players are still showing up
- [ ] handle players not present - generate number of benches dynamically.
- [ ] handle not enough players to fill the game - consider the idea of a blank placeholder

## Missing Concepts

At some point the order may be that players that did not get their preference go to the top of the round.

If inside the round we find that no more preferred positions are available... what do we do?

- [x] Try to put the player in the next postion down the ranking

- [ ] Do we need to know how many times each player can start in its favorite position?

- [x] We should look at the number of times each player can start in a game.

- [ ] Count the number of favorited positions vs available in the game.

## Feature Ideas

- Abstract for use in other sports

- Add ability to pick from list of positions and formations for multiple instances of the same position on the pitch or create your own.

- Goalie is added by default for local U8, but need to consider broader use
