import * as _shuffle from 'lodash/shuffle';
export function createGame(periodCount, positions) {
  let game = [];
  for(let i = 0; i < periodCount; i++){
    let period = [];
    for(let j = 0; j < positions.length; j++){
      period.push("");
    }
    game.push(period);
  }
  return game;
}
export function generateGamePlacementFromShuffle(periodCount, players, positions) {
  if(positions === undefined){
  return [];
}
  let game = createGame(periodCount, positions);
  //console.log(game)
  for (let i = 0; i < periodCount; i++) {
    if (game[i].every((spot) => spot === "")) {
      let evaluationPeriod = _shuffle(players);
      console.log(evaluationPeriod)
      game[i] = evaluationPeriod;
    }
  }

  return game;
}

export function createBlankPeriod() {
  let emptyPeriod = [];
  for (let i = 0; i < Players.length; i++) {
    emptyPeriod.push("");
  }
  return emptyPeriod;
}

export function sumPlayerScores(game, players, positions, periodCount) {

  let playerScores = [];
  if(players === undefined || positions === undefined){
  return playerScores;
}
  for (let player of players) {
    let playerScore = 0;
    for (let i = 0; i < periodCount; i++) {
      for (let j = 0; j < positions.length; j++) {
        if (game[i][j] !== "" && game[i][j].name === player.name) {
          // the player has ranked preferences- subtracting the rank of the position from total number
          // of positions gives us the score. sum for all periods.
          playerScore += positions.length - player.pref.indexOf(positions[j]);
        }
      }

    }
    playerScores.push(playerScore);
  }
  return playerScores;
}

export function getAveragePlayerScore(playerScores){
  if(playerScores.length === 0){
  return 0;
}
  return playerScores.reduce((a, b) => a + b) / playerScores.length;
}

export function getGameScoreDistribution(playerScores) {
  // the players each have a score, find the sum of the differences between player scores along the range.
  playerScores.sort((a, b) => a - b).reverse();
let diffs = [];
for(let i = 0; i < playerScores.length; i++){
  diffs.push(playerScores[i] - playerScores[i + 1]);
}
diffs.pop();
if(diffs.length === 0){
return 0;
}
return diffs.reduce((a, b) => a + b);
}

export function getGameScoreRatio(game, players, positions, periodCount){
  const playerScores = sumPlayerScores(game, players, positions, periodCount);
  const avg = getAveragePlayerScore(playerScores);
  console.log(`average: ${avg}`);
  const distrib = getGameScoreDistribution(playerScores);
  console.log(`distrib: ${distrib}`)
  const ratio = avg / (distrib + 1);
  console.log(ratio);
  return ratio;
}

