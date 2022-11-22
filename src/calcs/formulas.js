export default class fm {
	// calcs the cost of the nth building with x ratio
	static geomSequenceSum(base, ratio, count) {
		return base * Math.pow(ratio, count);
	}

	// takes time in seconds and formats it to h/m/s
	static formatToTime(t) {
    let text = '';
    if (t > 3600) {
      text += Math.floor(t/3600).toString() + "h "
      t -= 3600*Math.floor(t/3600);
    }
    if (t >= 60) {
      text += Math.floor(t/60).toString() + "m "
      t -= 60*Math.floor(t/60);
    }
    text += Math.round(t).toString() + "s"
    return text;
  }

  static calcGloryBonusProduction(fame, type) {
    if (fame < 1000) {
      return 0;
    } else {
      return Math.pow((fame-1)/4, 0.575) 
    }
  }

  static calcGloryCostRatioReduction(fame) {
    if (fame < 50000) {
      return 0;
    } else {
      return 12 - (13.4943 / Math.pow(fame, 0.03)) ;
    }
  }

}