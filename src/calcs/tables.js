// lookup tables
export default class tb {
  
  // base difficulty based on resource required (1 - 4)
  static jobDifficultyTable() {
    return {
      default: 3,
      kelp: 1,
      sand: 1,
      wood: 1,
      copper: 1,
      iron: 2,
      coal: 2,
      gold: 2,
      
      science: 2
    }
  }

// base glory gain per job based on its difficulty
  static difficultyGloryTable() {
    return {
      1: 10,
      2: 25,
      3: 70,
      4: 135,
      5: 300,
      6: 650,
      7: 1250,
      8: 2750,
      9: 6500,
      10: 15000,
      11: 35000,
      12: 70000,
    }
  }
}