import {generateGamePlacementFromShuffle, getGameScoreRatio} from './game-utils'
import * as _shuffle from 'lodash/shuffle';

export class DNA {
  constructor(num, players, positions) {
    // The genetic sequence
    this.players = players;
    this.positions = positions;
    this.periodCount = num;
    this.genes = generateGamePlacementFromShuffle(num, players, positions);
    this.fitness = 0;

  }


  // Fitness function
  calcFitness(target) {
    this.fitness = getGameScoreRatio(this.genes, this.players, this.positions, this.periodCount);
  }

  // Crossover
  crossover(partner) {
    // A new child
    let child = new DNA(this.genes.length);

    let midpoint = Math.floor(Math.random(this.genes.length)); // Pick a midpoint

    // Half from one, half from the other
    for (let i = 0; i < this.genes.length; i++) {
      if (i > midpoint) child.genes[i] = this.genes[i];
      else child.genes[i] = partner.genes[i];
    }
    return child;
  }

  // Based on a mutation probability, picks a new random (in this case, sports game period lineup)
  mutate(mutationRate) {
    for (let i = 0; i < this.genes.length; i++) {
      if (Math.random(1) < mutationRate) {
        this.genes[i] = _shuffle(this.players);
      }
    }
  }
}
