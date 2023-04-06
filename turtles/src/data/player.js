// @ts-nocheck
// @ts-ignore
import {writable, get} from 'svelte/store';
// lmofao
// @ts-ignore
import {builds, allGens, allBonuses, allSubtracts, buildCounts} from './buildings.js';

/**
 * @param {{ kelp: number[]; sand: number[]; wood: number[]; copper: number[]; iron: number[]; coal: number[]; science: number[]; fame: number[]; glory: number[]; }} info
 */
function playerRes(info) {
	// @ts-ignore
	const { subscribe, set, update, get } = writable(info);

	return {
		subscribe,
		/**
		 * @param {string | number} type
		 * @param {any} amt
		 */
		add(type, amt) {
			update(i => {
					// @ts-ignore
					if (i[type][1] > -0.9) {
		      			// @ts-ignore
		      			i[type][0] = (i[type][0] + (amt) < i[type][1] ? i[type][0]+(amt) : i[type][1])
		      			return i;
		      		} else {
		      			// @ts-ignore
		      			i[type][0] += amt;
		      			return i;
		      		}      		
		     })
		},
		craftAdd(type, amt) {
			update(i => {
		      			i[type][0] += amt;
		      			return i;     		
		     })
		},
		permanentUnlock(type) {
			update(i => {
				i[type][2] = 1;
				return i;
			})
		},
		// adds many at once with typical object format (type: amt)
		/**
		 * @param {{ [s: string]: any; } | ArrayLike<any>} obj
		 * @param {number} multi
		 */
		addMany(obj, multi, abs=false, posOnly = false) {// posOnly for total resources
			update(i => {
				let amt;
				for (let [type, namt] of Object.entries(obj)) {
					if (abs) {
						amt = Math.abs(namt);
					} else {
						amt = namt;
					}
					if (amt >= 0) {
						// @ts-ignore
						//console.log(type);	
						if (i[type][1] > -0.9) {
			      			// @ts-ignore
			      			i[type][0] = (i[type][0] + (amt*multi) < i[type][1] ? i[type][0]+(amt*multi) : i[type][1])
			      			
			      		} else {
			      			// @ts-ignore
			      			i[type][0] += amt*multi;
			      			
			      		}
			      		// if res value is at zero, set lockout flag to 1, otherwise 0
			      		if (i[type][0] > 0) {
			      			i[type][3] = 0;
			      		}

			      	} else if (!posOnly) {
			      		// @ts-ignore
						// remember: since amt < 0, still use ADDITION!!!
			      		i[type][0] = (i[type][0] + (amt*multi) > 0 ? i[type][0]+(amt*multi) : 0)
			      		// if res value is at zero, set lockout flag to 1, otherwise 0
			      		if (i[type][0] <= 0) {
			      			i[type][3] = 1;
			      		} else {
			      			i[type][3] = 0;
			      		}
			      	}
				}
				return i;
	    	})
	      	
		},

		/**
		 * @param {string} type
		 * @param {number} amt
		 */
		addCap(type, amt) {
			update(i => {
	      		// @ts-ignore
	      		i[type][1] = (i[type][1] + amt)

	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		/**
		 * @param {{ [s: string]: any; } | ArrayLike<any>} obj
		 */
		addCapMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		// @ts-ignore
		      		i[type][1] = (i[type][1] + amt)
		      		return i;
	      		})
	      	}
		},
		/**
		 * @param {string | number} type
		 * @param {number} amt
		 */
		sub(type, amt) {
			update(i => {
	      		// @ts-ignore
	      		i[type][0] = (i[type][0] - amt > 0 ? i[type][0]-amt : 0)
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		/**
		 * @param {{ [s: string]: any; } | ArrayLike<any>} obj
		 */
		subMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		// @ts-ignore
		      		
		      		i[type][0] = (i[type][0] - amt > 0 ? i[type][0]-amt : 0)
		      		return i;
	      		})
	      	}
		},
		// note that set overrides any resource caps, so don't use this unless necessary!
		/**
		 * @param {string | number} type
		 * @param {any} amt
		 */
		setItem(type, amt) {
			update(i => {
	      		// @ts-ignore
	      		i[type][0] = amt;
	      		return i;
      		})
		},
		set(amt) {
			update(i => {
				i = amt;
				return i;
			})
		},
		// adds many at once with typical object format (type: amt)
		/**
		 * @param {{ [s: string]: any; } | ArrayLike<any>} obj
		 */
		setMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		// @ts-ignore
		      		i[type][0] = amt;
		      		return i;
	      		})
	      	}
		},
		/**
		 * @param {string | number} type
		 * @param {any} amt
		 */
		setCap(type, amt) {
			update(i => {
	      		// @ts-ignore
	      		i[type][1] = amt;
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		/**
		 * @param {{ [s: string]: any; } | ArrayLike<any>} obj
		 */
		setCapMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		// @ts-ignore
		      		i[type][1] = amt;
		      		return i;
	      		})
	      	}
		},
		/**
		 * @param {any} obj
		 */
		setSelf(obj) {
			update(i => {
				i = obj;
				return i;
			})
		},
		getSelf() {
			update (i => {
				return i;
			})
		},
		clear() {
			update(i => {
				for (let c of Object.entries(i)) {
					// @ts-ignore
					i[c[0]][0] = 0;
				}
				return i;
			});
		}
	};
}

// basic add/sub/set functions
// use for simple stores that don't have multiple "layers" of depth
function basic(info) {
	// @ts-ignore
	const { subscribe, set, update, get } = writable(info);

	return {
		subscribe,
		/**
		 * @param {string | number} type
		 * @param {any} amt
		 */
		add(type, amt) {
			update(i => {
					// @ts-ignore
		      			// @ts-ignore
		      			i[type] = (i[type] || 0) + amt
		      			return i;
     		
		     })
		},
		// add item to a set
		setAdd(value, key=null) {
			update (i => {
				if (!key) {
					i.add(value)
				} else {
					i[key].add(value)
				}
				return i;
			})
		},
		setRem(value, key=null) {
			update (i => {
				if (!key) {
					i.delete(value)
				} else {
					i[key].delete(value)
				}
				return i;
			})
		},
		setClear(value) {
			update(i => {
				for (let c of Object.entries(i)) {
					i[c[0]].clear();
				}
				return i;
			})
		},
		setSelf(obj) {
			update (i => {
				i = obj;
				if (i['science']) console.log(i);
				return i;
			})
		},
		set(key, value) {
			update(i => {
				i[key] = value;
				return i;
			})
		},
		// sets all values in an object to zero, unless there is a default value given
		reset(except) {
			update(i => {
				for (let c of Object.entries(i)) {
					console.log(c[0]);
					console.log(i[c[0]]);
					i[c[0]] = (except?.c[0] || 0)
				}
				return i;
			})
		}
	};
}

// RESOURCES_UPDATER
// update as new resources are added 
// index 0 - the resource amount
// index 1 - the cap amount, or -1 if uncapped
export const res = playerRes({
	kelp: [0,500,0,0],
	sand: [0,50,0,0],
	wood: [0,50,0,0],
	copper: [0,100,0,0],
	iron: [0,100,0,0],
	coal: [0,50,0,0],
	gold: [0,25,0,0],
	oil: [0,0,0,0],
	cobalt: [0,50,0,0],

	science: [0,200,0,0],
	favor: [0,10,0,0],
	magic: [0,35,0,0],
	power: [0,-1,0,0],
	karma: [0,-1,0,0],
	fame: [0,-1,0,0],
	glory: [0,-1,0,0],
	stardust: [0,-1,0,0]
});

// update as new resources are added 
// index 0: amount
// index 1: cap (-1 if uncapped)
// index 2: resource unlocked
// index 3: resource "lockout" - if 1, then resource will not be produced
export const baseRes = playerRes({
	kelp: [0,500,0,0],
	sand: [0,50,0,0],
	wood: [0,50,0,0],
	copper: [0,100,0,0],
	iron: [0,100,0,0],
	coal: [0,50,0,0],
	gold: [0,25,0,0],
	oil: [0,0,0,0],
	cobalt: [0,50,0,0],

	science: [0,200,0,0],
	favor: [0,25,0,0],
	magic: [0,35,0,0],
	power: [0,-1,0,0],
	karma: [0,-1,0,0],
	fame: [0,-1,0,0],
	glory: [0,-1,0,0],
	stardust: [0,-1,0,0]
});

// update as new resources are added 
export const totalRes = playerRes({
	kelp: [0,500,0,0],
	sand: [0,50,0,0],
	wood: [0,50,0,0],
	copper: [0,100,0,0],
	iron: [0,100,0,0],
	coal: [0,50,0,0],
	gold: [0,25,0,0],
	oil: [0,0,0,0],
	cobalt: [0,50,0,0],

	science: [0,200,0,0],
	favor: [0,25,0,0],
	magic: [0,35,0,0],
	power: [0,-1,0,0],
	karma: [0,-1,0,0],
	fame: [0,-1,0,0],
	glory: [0,-1,0,0],
	stardust: [0,-1,0,0]
});

// index 0: amount
// index 1: is resource unlocked
// index 2: lockout
/* index 3: "tier" of crafted res
   Each tier requires a different
   technology to unlock.
*/
export const craftRes = playerRes({
	plank: [0,0,0,1],
	tinder: [0,0,0,1],
	steel: [0,0,0,1],
	alloy: [0,0,0,2],
	spring: [0,0,0,2],
	wire: [0,0,0,2],

	journal: [0,0,0,2],


})

export const baseCraftRes = playerRes({
	plank: [0,0,0,1],
	tinder: [0,0,0,1],
	steel: [0,0,0,1],
	alloy: [0,0,0,2],
	spring: [0,0,0,2],
	wire: [0,0,0,2],

	journal: [0,0,0,2],
})

export const craftCosts = basic({
	plank: {
		wood: 300
	},
	tinder: {
		kelp: 2500,
		sand: 100
	},
	steel: {
		iron: 300,
		coal: 300
	},
	spring: {
		iron: 250,
		craftable: {
			steel: 30
		}
	},
	journal: {
		science: 20000,
		favor: 50
	},
	alloy: {
		copper: 2500,
		craftable: {
			steel: 75
		}
	},
	wire: {
		copper: 150,
		gold: 45
	},


})

export const craftTier = writable(0);

export const unlockedResources = writable(new Set())

export const fameTab = basic({
	gloryLevel: 1,
	gloryLevelTarget: 10,
	jobMaxDiff: 4,
	// index 0 - job cooldown
	// index 1 - job max difficulty
	// index 2 - number of jobs
	jobUpgrades: [
		{
			index: 0,
			level: 0,
			baseCost: 100,
			ratio: 1.15
		},
		{
			index: 1,
			level: 0,
			baseCost: 500,
			ratio: 3
		},
		{
			index: 2,
			level: 0,
			baseCost: 25000,
			ratio: 5
		},
	]
})

export const baseFameTab = basic({
	gloryLevel: 1,
	gloryLevelTarget: 10,
	jobMaxDiff: 4,
	jobUpgrades: [
		{
			index: 0,
			level: 0,
			baseCost: 100,
			ratio: 1.15
		},
		{
			index: 1,
			level: 0,
			baseCost: 7500,
			ratio: 2.5
		},
		{
			index: 2,
			level: 0,
			baseCost: 25000,
			ratio: 5
		},
	]
})

export const policyTab = basic({
	policyLevel: 0,
	policiesResearched: 0
})

export const basePolicyTab = basic({
	policyLevel: 0,
	policiesResearched: 0
})

export const magicTab = basic({
	sigilsBought: 0,
	sigils: [0,0,0,0,0,0,0],
	magicCapUpgrades: 0
})

export const baseMagicTab = basic({
	sigilsBought: 0,
	sigils: [0,0,0,0,0,0,0]

})

export const religionTab = basic({
	karmaBanked: 0,
})

export const stardustTab = basic({
	lastReset: -1,
	basicUpgrades: [0,0,0,0,0,0,0,0,0,0,0,0],
	generators: [0,0,0,0]
})

export const baseStardustTab = basic({
	lastReset: -1,
	basicUpgrades: [0,0,0,0,0,0,0,0,0,0,0,0],
	generators: [0,0,0,0]
})

export const visible = basic({
	builds: new Set(),
	science: new Set(),
	policy: new Set(),  
	stardust: new Set()
})

export const researched = basic({
	builds: new Set(),
	science: new Set(),
	policy: new Set(),
	stardust: new Set()
})

export const policyBonuses = basic({
	// key: building NAME (not id)
	// value: bonus as a decimal (e.g. 0.08 = 8% bonus)
})

// add to here every time there is a new glory bonus
export const gloryBonuses = playerRes({
	'Production Bonus': [0],
	'Cost Ratio Reduction': [0]
})


export const flags = basic({
	updateCapFlag: 0 // if 1, then the next big tick (1s) will update all caps and set flag to 0
})