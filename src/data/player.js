// @ts-nocheck
// @ts-ignore
import {writable, get} from 'svelte/store';
// @ts-ignore
import {builds, allGens, allBonuses, allSubtracts} from './buildings.js';

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
		set(type, amt) {
			update(i => {
	      		// @ts-ignore
	      		i[type][0] = amt;
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
		      			i[type][0] = i[type][0] + amt
		      			return i;
     		
		     })
		},
	};
}

// update as new resources are added 
// index 0 - the resource amount
// index 1 - the cap amount, or -1 if uncapped
export const res = playerRes({
	kelp: [0,500,0,0],
	sand: [0,50,0,0],
	wood: [0,50,0,0],
	copper: [0,100,0,0],
	iron: [0,100,0,0],
	coal: [0, 50,0,0],
	gold: [0,25,0,0],

	science: [0,200,0,0],
	fame: [0,-1,0,0],
	glory: [0,-1,0,0]
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
	science: [0,200,0,0],
	fame: [0,-1,0,0],
	glory: [0,-1,0,0],
});

// update as new resources are added 
export const totalRes = playerRes({
	kelp: [0,500,0],
	sand: [0,50,0],
	wood: [0,50,0],
	copper: [0,100,0],
	iron: [0,100,0],
	coal: [0,50,0],
	gold: [0,25,0],
	
	science: [0,200,0],
	fame: [0,-1,0],
	glory: [0,-1,0],
});

export const fameTab = basic({
	gloryLevel: 9,
	gloryLevelTarget: 10
})

// add to here every time there is a new glory bonus
export const gloryBonuses = playerRes({
	'Production Bonus': [0],
	'Cost Ratio Reduction': [0]
})