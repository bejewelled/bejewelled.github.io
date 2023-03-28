// @ts-nocheck
import {get, writable} from 'svelte/store'
import {builds, buildCounts, allGens, allBonuses} from './buildings.js'
import {res, visible, researched} from './player.js'
/**
 * @param {{ 0: { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; 
// the IDs of the stardust prerequisites to unlock this one (check README)
criteria: never[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; 
// the IDs of the stardust prerequisites to unlock this one (check README)
criteria: never[]; }; 1: { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; }; 2: { id: number; name: string; description: string; costs: { stardust: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; }; 3: { id: number; name: string; description: string; costs: { stardust: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; }; 4: { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; }; 5: { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; }; 6: { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; }; 7: { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; }; 8: { id: number; name: string; description: string; costs: { stardust: number; fame: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; fame: number; }; researched: boolean; available: boolean; criteria: number[]; }; 9: { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; }; 10: { id: number; name: string; description: string; costs: { stardust: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; }; 11: { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { stardust: number; }; researched: boolean; available: boolean; criteria: number[]; }; }} info
 */
function stardustCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		/**
		 * @param {string | number} id
		 */
		unlock(id) {
			update(i => {
	      		i[id]['researched'] = true;
	      		return i;
      		})
		},
		/**
		 * @param {string | number} id
		 */
		lock(id) {
			update(i => {
	      		i[id]['researched'] = false;
	      		return i;
      		})
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
		/**
		 * @param {string | number} id
		 * @param {any} item
		 */
		addNew(id, item) {
			update(i => {
				i[id] = item;
				return i;
			})
		},
		setItemVal(id, key, val) {
			update(i => {
				i[id][key] = val;
				return i;
			})
		},
		// lockAll() {
		// 	update(i => {
		// 		for (let k of Object.entries(i)) {
		// 			visible.setRem(k[0], 'stardust')
		// 		}
		// 		visible.setAdd('infrastructure', 'stardust')
		// 		return i;
		// 	})
		// },
		checkCriteria() {
			update(i => {
				for (let b of Object.entries(i)) {
					console.log(b)
					if (b[0] === 'infrastructure') {
						visible.setAdd(b[0], 'stardust');
						continue;
					}
					let isSatisfied = true;
					for (let req of b[1]['criteria']) {
						if (!(get(researched)['stardust'].has(req))) {
							console.log('ad')
							isSatisfied = false;

							break;
						}

					}
					if (isSatisfied === true) {
						visible.setAdd(b[0], 'stardust')
					}
					
				}
				return i;
			})
		},
		getSelf() {
			update(i => {
				return i;
			})
		}
	}
}

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
		},
	};
}

export const stardustBasics = basic([
	/*
	0 - resource gain
	1 - glory gain (jobs)
	2 - karma bank gain
	3 - time acceleration
	*/
	{
		id: 0,
		label: 'resGain',
		base: 1,
		ratio: 1.2,
		formula: (lv) => {
			return (lv<=60 ? 1+(lv*0.01) : (1.61 + 0.01*Math.pow(lv-60, 0.9)));
		}
	},
	{
		id: 1,
		label: 'gloryGain',
		base: 1,
		ratio: 1.2,
		formula: (lv) => {
			return 1+lv*0.10;
		}
	},
	{
		id: 2,
		label: 'karmaBankBonusGain',
		base: 1,
		ratio: 1.2,
		formula: (lv) => {
			return 1+Math.pow(lv/12, 1.25);
		}
	},
	// tier 2 base upgrades
	{
		id: 3,
		label: 'favorCap',
		base: 100,
		ratio: 1.27,
		formula: (lv) => {
			return lv*5;
		}
	},
	{
		id: 4,
		label: 'stardustTimeBonusIncrease',
		base: 100,
		ratio: 1.27,
		formula: (lv) => {
			return 0.6+(0.375 * (lv / (lv+20)));
		}
	},
	{
		id: 5,
		label: 'craftYield',
		base: 100,
		ratio: 1.27,
		formula: (lv) => {
			return Math.pow(0.06*lv, 0.7)+1;
		}
	},
	{
		// remember to change the formula in calcStardustGain if you change this one!
		id: 6,
		label: 'stardustConstant',
		base: 10000,
		ratio: 1.33,
		formula: (lv) => {
			return Math.pow(3*lv, 0.95);
		}
	},
	{
		id: 7,
		label: 'craftYield',
		base: 10000,
		ratio: 1.33,
		formula: (lv) => {
			return Math.pow(0.06*lv, 0.7)+1;
		}
	},
	{
		id: 8,
		label: 'craftYield',
		base: 10000,
		ratio: 1.33,
		formula: (lv) => {
			return Math.pow(0.06*lv, 0.7)+1;
		}
	},
	{
		id: 9,
		label: 'craftYield',
		base: 1e7,
		ratio: 1.36,
		formula: (lv) => {
			return Math.pow(0.06*lv, 0.7)+1;
		}
	},
	{
		id: 10,
		label: 'craftYield',
		base: 1e7,
		ratio: 1.36,
		formula: (lv) => {
			return Math.pow(0.06*lv, 0.7)+1;
		}
	},
	{
		id: 11,
		label: 'craftYield',
		base: 1e7,
		ratio: 1.36,
		formula: (lv) => {
			return Math.pow(0.06*lv, 0.7)+1;
		}
	},

])

export const stardustGenerators = basic([
	/*
	0 - resource gain
	1 - glory gain (jobs)
	2 - karma bank gain
	3 - time acceleration
	*/
	{
		id: 0,
		label: 't1generators',
		base: 1e8,
		ratio: 1.33,
		formula: (lv) => {
			return Math.pow(lv, 0.15) * 0.5;
		}
	},
	{
		id: 0,
		label: 't2generators',
		base: 1e10,
		ratio: 1.33,
		formula: (lv) => {
			return Math.pow(lv, 0.14) * 0.2;
		}
	},
	{
		id: 0,
		label: 't3generators',
		base: 1e11,
		ratio: 1.33,
		formula: (lv) => {
			return Math.pow(lv, 0.13) * 0.02;
		}
	},
	{
		id: 0,
		label: 't4generators',
		base: 1e12,
		ratio: 1.33,
		formula: (lv) => {
			return Math.pow(lv, 0.12) * 0.002;
		}
	},
	

])





