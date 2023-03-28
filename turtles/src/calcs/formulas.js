export default class fm {

  static sumArray(arr) {
    return arr.reduce((pv, cv) => pv + cv, 0);
  }
	// calcs the cost of the nth building with x ratio
	static geomSequenceSum(base, ratio, count) {
		return base * Math.pow(ratio, count);
	}

  static geomSum(base, ratio, count) {
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
      return 1;
    } else {
      return 1+ Math.pow(lv,2)/3600
    }
  }

  // returns the decimal bonus (need to add one for a multiplier)
  static calcPolicyGlobalBonus(lv) {
    return (Math.pow(lv, 1.2)/100);
  }

  static calcKarmaBankBonus(karma, stardustBonus) {
    const magnitudeBonus = ((stardustBonus+1) * Math.log10(karma+1))+1;
    return (1 + magnitudeBonus*(Math.pow(karma, 0.2) + (Math.log(karma) / Math.log(1.5)))/100);
  }

  static findGloryNextTarget = (lv) => {
    return (Math.floor(Math.pow(1.1, lv) 
    * 10 * Math.pow(lv,4) * 0.01) / 0.01)}


  static calcKarmaPoints(karma, light=1) {
    const effLight = Math.max(light, 1);
    return Math.log(1+karma*effLight*0.0003)/ Math.log(5);
  }

  static calcTimeBonus(lastReset, stardustUpgrades) {
    // based on hours
    // stardust bonus (leo, index 4)

    const slv = stardustUpgrades[4];
    const exp = 0.6+(0.375 * (slv / (slv+20)))
    return 1 + (lastReset > 0 ? Math.pow((Date.now() - lastReset) / 3.6e6, exp) : 0);
  }

  // calc score that determines stardust gain.
  static calcStardustGain(gloryLevel, policiesCompleted, karmaPoints, lastReset, stardustUpgrades) {
    // resPoints / karmaPoints are calculated by the caller
    let a = Math.pow(gloryLevel,2.5) / 100; // glory level
    let b = Math.pow(1.025,policiesCompleted)-1;
    let c = karmaPoints; // karmaPoints
    let d = this.calcTimeBonus(lastReset, stardustUpgrades);
    let e = Math.pow(3*stardustUpgrades[6], 0.95)

    const total = Math.floor((a + b + e) * c * d) + 1600;
    return [total, a, b, c, d, e];
  }

}
