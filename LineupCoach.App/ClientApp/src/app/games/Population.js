import { DNA } from './DNA';

export class Population {

  constructor(p, m, num, players, positions) {
    console.log(`Population constructor ${positions.forEach(position => position)}`);
    this.population; // Array to hold the current population
    this.matingPool; // ArrayList which we will use for our "mating pool"
    this.generations = 0; // Number of generations
    this.finished = false; // Are we finished evolving?
    // PROBLEM - a soccer lineup not have a target.
    this.target = p; // Target phrase
    console.log(`target is: ${p}`);
    this.mutationRate = m; // Mutation rate
    this.perfectScore = 8;

    // PROBLEM it's a soccer lineup, not a string
    this.best = [];

    this.population = [];
    for (let i = 0; i < num; i++) {
      this.population[i] = new DNA(this.target.length, players, positions);
    }
    this.matingPool = [];
    this.calcFitness();
  }

  // Fill our fitness array with a value for every member of the population
  calcFitness() {
    for (let i = 0; i < this.population.length; i++) {
      this.population[i].calcFitness(this.target);
    }
  }

  // Create a new generation
  generate() {
    let maxFitness = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > maxFitness) {
        maxFitness = this.population[i].fitness;
      }
    }

    // Refill the population with children from the mating pool
    let newPopulation = [];
    for (let i = 0; i < this.population.length; i++) {
      let partnerA = this.acceptReject(maxFitness);
      let partnerB = this.acceptReject(maxFitness);
      if(partnerA && partnerB) {
      let child = partnerA.crossover(partnerB);

      child.mutate(this.mutationRate);
      newPopulation[i] = child;
      }
    }
    if(newPopulation.length > 0) {
    this.population = newPopulation;
    this.generations++;
    }
  }

  acceptReject(maxFitness) {
    let besafe = 0;
    while(true) {
      let index = Math.floor(Math.random(this.population.length));
      let partner = this.population[index];
      let r = Math.random(maxFitness);
      if (r < partner.fitness) {
        return partner;
      }
      besafe++;

      if (besafe > 10000) {
        return null;
      }
    }
  }

  getBest() {
    return this.best;
  }

  // Compute the current "most fit" member of the population
  evaluate() {
    let worldrecord = 0.0;
    let index = 0;
    for (let i = 0; i < this.population.length; i++) {
      if (this.population[i].fitness > worldrecord) {
        index = i;
        worldrecord = this.population[i].fitness;
      }
    }

    this.best = this.population[index];
    if (worldrecord >= this.perfectScore) {
      this.finished = true;
    }
  }

  isFinished() {
    return this.finished;
  }

  getGenerations() {
    return this.generations;
  }

  // Compute average fitness for the population
  getAverageFitness() {
    let total = 0;
    for (let i = 0; i < this.population.length; i++) {
      total += this.population[i].fitness;
    }
    return total / this.population.length;
  }

  getPopulace() {
    let everything = [];

    let displayLimit = min(this.population.length, 50);

    for (let i = 0; i < displayLimit; i++) {
      everything.push(this.population[i]);
    }
    return everything;
  }
}
