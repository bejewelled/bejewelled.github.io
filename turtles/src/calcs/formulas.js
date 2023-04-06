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

  static finiteGeomSum (a,r,n) {
    if (r === 1) {
      return a * n; // If r = 1, the sum is just a*n.
    } else {
      return a * (1 - Math.pow(r, n)) / (1 - r);
    }
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

  static getBaseSigilProbTable() {
    return [100,0,0,0,0,0,0];

  }

  static getSigilProbTable(n) {
    let base = this.getBaseSigilProbTable();
    const mult = Math.pow(n,0.5);
    let change = [
      0,
      0.04 * mult,
      0.008 * mult,
      0.001 * mult,
      0.0001 * mult,
      1e-6 * mult,
      1e-8 * mult
    ]
    base = base.map(function(v,i) { return (v + change[i]); }); 
    base[0] -= this.sumArray(change);
    return base;
  }

  static getSigilProbTableIndex(n, index) {
    let base = this.getBaseSigilProbTable();
    const mult = Math.pow(n,0.5);
    let change = [
      0,
      0.04 * mult,
      0.008 * mult,
      0.001 * mult,
      0.0001 * mult,
      1e-6 * mult,
      1e-8 * mult
    ]
    base = base.map(function(v,i) { return (v + change[i]); }); 
    base[0] -= this.sumArray(change);
    return base[index];
  }


  static getNextSigil(probTable) {
    let rand = Math.random() * 100;
    for (let i = 0; i < probTable.length; i++) {
      rand -= probTable[i];
      if (rand < 0) {
        return i;
      }
    }
    return 6;
  }

  // this is per tick, not per second
  static calcSigilPowerGain(sigils) {
    let base = Math.pow(sigils[0]*0.1, 0.25)+(0.001*sigils[0]);
    base = base *
    (1+Math.pow(sigils[1], 0.6))      *
    (1+Math.pow(sigils[2], 0.7))      *
    (1+Math.pow(sigils[3], 0.8))      *
    (1+Math.pow(sigils[4], 0.9)*1.25) *
    (1+Math.pow(sigils[5], 1)  *2)    *
    (1+Math.pow(sigils[6], 1.1)*4)   

    return base / 5; 
  }

  // this is per second, not per tick
  static getSigilPowerArray(sigils) {
    let array = [
    Math.pow(sigils[0]*0.1, 0.25)+(0.001*sigils[0])/5,
    (1+Math.pow(sigils[1], 0.6)),     
    (1+Math.pow(sigils[2], 0.7)),      
    (1+Math.pow(sigils[3], 0.8)),      
    (1+Math.pow(sigils[4], 0.9)*1.25),
    (1+Math.pow(sigils[5], 1)  *2),   
    (1+Math.pow(sigils[6], 1.1)*4),  
    ]
    return array;
  }

  static getPowerCraftCost(cid, tier) {
    let base = 1000 * Math.pow(tier, 6);
    switch (cid) {
      case 'alloy':
        base *= 8;
        return base;
      default:
        return base;
    }
  }

}
