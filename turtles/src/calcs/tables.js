// lookup tables
export default class tb {
  static baseCaps() {
    return {
      
    }
  }

  static craftTiers() {
    return {
      default: 1,
      plank: 1,
      tinder: 1,
      steel: 1
    }
  }
  
  // base difficulty based on resource required
  // only add here if difficulty > 1
  static jobDifficultyTable() {
    return {
      default: 1,
      gold: 2,
    }
  }

// base glory gain per job based on its difficulty
  static difficultyGloryTable() {
    return {
      0: 100,
      1: 225,
      2: 450,
      3: 750,
      4: 1200,
      5: 2000,
      6: 3250,
      7: 5000,
      8: 8500,
      9: 15000,
      10: 35000,
      11: 75000,
      12: 150000,
    }
  }

  static powerCraftCostBase() {
    return {
      1: 1000,
      2: 40000,
      3: 2e6,
      4: 5e7,
      5: 3e9
    }
  }

}