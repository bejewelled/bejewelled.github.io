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

  static calcGloryBonusProduction(lv) {
    if (lv < 5) {
      return 0;
    } else {
      return Math.pow(lv,2)/3600
    }
  }

  // job difficulty is on a scale of 1 - 8

}
