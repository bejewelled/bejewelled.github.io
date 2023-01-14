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
      1: 10,
      2: 25,
      3: 60,
      4: 200,
      5: 900,
      6: 2000,
      7: 7000,
      8: 24500,
      9: 58500,
      10: 150000,
      11: 350000,
      12: 800000,
    }
  }
}