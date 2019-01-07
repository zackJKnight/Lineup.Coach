# Console App to Aid the New Youth Soccer Coach

Code in progress to aid my thinking about filling a lineup for a game of 8 year olds.

## Missing Concepts

Placing by player preference alone leaves out the fact that the Game has needs that aren't always met by the player's prefs.

- [x] We know how many positions each player can start in. 

- [ ] Determine bench count per game. How many times will each player sit?

- [ ] When a player starts in the number of positions the game can afford, we can skip to a player that isn't fulfilled.

- [ ] How about counting the number of preferred positions and determining which will get filled first/neglected?

- [x] Rounds: looping the player list in random order the first round.

At some point the order may be that players that did not get their preference go to the top of the round.

If inside the round we find that no more preferred positions are available... what do we do?

- [x] Try to put the player in the next postion down the ranking

- [ ] Do we need to know how many times each player can start in its favorite position?

- [x] We should look at the number of times each player can start in a game.

- [ ] Count the number of favorited positions vs available in the game.

## Feature Ideas

- Add ability to pick from list of positions and formations for multiple instances of the same position on the pitch or create your own.

- Goalie is added by default for local U8, but need to consider broader use