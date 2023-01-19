// lookup tables
export default class tb {
  static baseCaps() {
    return {
      
    }
  }
  
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
      0: 50,
      1: 125,
      2: 250,
      3: 450,
      4: 800,
      5: 1300,
      6: 2250,
      7: 5000,
      8: 9500,
      9: 16000,
      10: 35000,
      11: 90000,
      12: 150000,
    }
  }

}