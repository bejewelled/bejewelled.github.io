// lookup tables
export default class tb {
  
  // base difficulty based on resource required
  // only add here if difficulty > 1
  static jobDifficultyTable() {
    return {
      gold: 2,
    }
  }

// base glory gain per job based on its difficulty
  static difficultyGloryTable() {
    return {
      0: 20,
      1: 35,
      2: 60,
      3: 125,
      4: 225,
      5: 500,
      6: 1200,
      7: 2250,
      8: 6500,
      9: 17500,
      10: 45000,
      11: 120000,
      12: 400000,
    }
  }

}