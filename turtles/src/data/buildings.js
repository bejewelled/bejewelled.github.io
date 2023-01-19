//@collapse
// @ts-nocheck
import {get, writable} from 'svelte/store'
import {science} from './science.js'
import {res, fameTab, policyBonuses, policyTab, visible, researched} from './player.js'
import {policy} from './policy.js' // if slowdowns occur try moving getPnum() to player.js
import fm from '../calcs/formulas.js'
/**
 * @param {{ 0: { id: number; name: string; description: string; costs: { kelp: number; }; ratio: number; gens: { kelp: number; }; caps: {}; toggleable: boolean; available: boolean; criteria: never[]; visible: boolean; } | { id: number; name: string; description: string; costs: { kelp: number; }; ratio: number; gens: { kelp: number; }; caps: {}; toggleable: boolean; available: boolean; criteria: never[]; visible: boolean; }; 1: { id: number; name: string; description: string; costs: { copper: number; iron: number; }; ratio: number; gens: {}; caps: {}; bonuses: { kelp: number; }; toggleable: boolean; available: boolean; criteria: number[]; visible: boolean; } | { id: number; name: string; description: string; costs: { copper: number; iron: number; }; ratio: number; gens: {}; caps: {}; bonuses: { kelp: number; }; toggleable: boolean; available: boolean; criteria: number[]; visible: boolean; }; 2: { id: number; name: string; description: string; costs: { kelp: number; }; ratio: number; gens: { sand: number; wood: number; }; caps: {}; toggleable: boolean; available: boolean; criteria: never[]; visible: boolean; } | { id: number; name: string; description: string; costs: { kelp: number; }; ratio: number; gens: { sand: number; wood: number; }; caps: {}; toggleable: boolean; available: boolean; criteria: never[]; visible: boolean; }; 3: { id: number; name: string; description: string; costs: { sand: number; }; ratio: number; gens: { science: number; }; caps: { science: number; }; toggleable: boolean; available: boolean; criteria: never[]; visible: boolean; } | { id: number; name: string; description: string; costs: { sand: number; }; ratio: number; gens: { science: number; }; caps: { science: number; }; toggleable: boolean; available: boolean; criteria: never[]; visible: boolean; }; 4: { id: number; name: string; description: string; costs: { sand: number; wood: number; }; ratio: number; gens: {}; caps: { kelp: number; sand: number; wood: number; }; toggleable: boolean; available: boolean; criteria: never[]; visible: boolean; } | { id: number; name: string; description: string; costs: { sand: number; wood: number; }; ratio: number; gens: {}; caps: { kelp: number; sand: number; wood: number; }; toggleable: boolean; available: boolean; criteria: never[]; visible: boolean; }; 5: { id: number; name: string; description: string; costs: { sand: number; wood: number; }; ratio: number; gens: {}; caps: {}; bonuses: { wood: number; }; toggleable: boolean; available: boolean; criteria: number[]; visible: boolean; } | { id: number; name: string; description: string; costs: { sand: number; wood: number; }; ratio: number; gens: {}; caps: {}; bonuses: { wood: number; }; toggleable: boolean; available: boolean; criteria: number[]; visible: boolean; }; 6: { id: number; name: string; description: string; costs: { sand: number; copper: number; }; ratio: number; gens: { kelp: number; wood: number; copper: number; iron: number; coal: number; }; caps: {}; bonuses: {}; toggleable: boolean; available: boolean; criteria: number[]; visible: boolean; } | { id: number; name: string; description: string; costs: { sand: number; copper: number; }; ratio: number; gens: { kelp: number; wood: number; copper: number; iron: number; coal: number; }; caps: {}; bonuses: {}; toggleable: boolean; available: boolean; criteria: number[]; visible: boolean; }; 7: { id: number; name: string; description: string; costs: { sand: number; wood: number; }; ratio: number; gens: { fame: number; }; caps: {}; bonuses: {}; toggleable: boolean; available: boolean; criteria: number[]; visible: boolean; } | { id: number; name: string; description: string; costs: { sand: number; wood: number; }; ratio: number; gens: { fame: number; }; caps: {}; bonuses: {}; toggleable: boolean; available: boolean; criteria: number[]; visible: boolean; }; }} info
 */
function buildings(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		/**
		 * @param {string | number} id
		 * @param {any} amt
		 */
		add(id, amt) {
			update(i => {
	      		buildCounts[id][0] += amt;
	      		return i;
      		})
		},
		/**
		 * @param {string | number} id
		 * @param {number} amt
		 */
		changeToggle(id, amt) {
			update(i => {
				let c = buildCounts[id]
				if (amt < 0) {
					buildCounts[id][1] = (c[1]-amt >= 0 ? c[1] - amt : 0);
				} else {
					buildCounts[id][1] = (c[1]+amt < c[0] ? c[1] + amt : c[0]);
				}
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
		 * @param {string | number} key
		 * @param {any} val
		 */
		setItemVal(id, key, val) {
			update(i => {
				i[id][key] = val;
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
		/**
		 * @param {number} id
		 * @param {string} key
		 * @param {{ [s: string]: any; }} val
		 */
		updateItemValue(id, key, val) {
			update(i => {
				i[id][key][Object.entries(val)[0][0]] = Object.entries(val)[0][1];
				return i;
			})
		},
		checkSciCriteria() {
			update(i => {
				for (let b of Object.entries(i)) {
					let isSatisfied = true;
					for (let sci of b[1]['criteria']) {
						if (!(get(researched)['science'].has(sci))) {
							isSatisfied = false;
						}
					}
					if (isSatisfied === true) {
						//console.log(b[0]);
						researched.setAdd(b[0].toLowerCase(), 'builds')
					}
				}
				return i;
			})
		},
		/**
		 * @param {string | number} id
		 */
		checkResUnlockThreshold(id) {
			update(i => {
				let costs = i[id]['costs']
				for (let c of Object.entries(costs)) {
					if (!(get(researched)['builds'].has(i[id]['name'].toLowerCase())) 
						|| get(res)[c[0]][0] <= 0.2*c[1]) {
						return i;
						
					}
				}

				visible.setAdd(i[id]['name'].toLowerCase(), 'builds')
				return i;
			})
		},
		hideAll() {
			update(i => {
				for (let c of Object.entries(i)) {
						i[c[0]]['visible'] = false;
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

/**
 * @param {{ 0: number | number[]; 1: number | number[]; }} info
 */
function buildingCountCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		/**
		 * @param {number} len
		 */
		init() {
			update(i => {
				const names = Object.keys(get(builds))
				for(let c = 0; c < names.length; c++) {
					i[names[c].toLowerCase()] = [0,0];
				}
				return i;
			})
		},
		/**
		 * @param {string | number} id
		 * @param {any} amt
		 */
		add(id, amt) {
			update(i => {
				i[id][0] += amt;
	      		if (!(get(builds)[id]['toggleable'])) {
	      			i[id][1] += amt;
	      		} else {
	      			i[id][1] = (i[id][1] + amt < i[id][0] ? i[id][1]+amt : i[id][0] );
	      		}
	      		return i;
      		})
		},
		/**
		 * @param {string | number} id
		 * @param {number} amt
		 */
		sub(id, amt) {
			update(i => {
				console.log(amt);
	      		i[id][0] -= (i[id][0] - amt > 0 ? amt : 0);
	      		if (!(get(builds)[id]['toggleable'])) {
	      			i[id][1] -= (i[id][1] - amt > 0 ? amt : 0);
	      		}

	      		return i;
      		})
		},
		/**
		 * @param {string | number} id
		 * @param {number} amt
		 */
		changeToggle(id, amt) {
			update(i => {
				let c = i[id]
				if (amt < 0) {
					i[id][1] = (c[1]+amt >= 0 ? c[1] + amt : 0);
				} else {
					i[id][1] = (c[1]+amt < c[0] ? c[1] + amt : c[0]);
				}
				console.log(i[id][1])
				return i;
			})
		},
		/**
		 * @param {any} obj
		 */
		setSelf(obj) {
			update(i => {
				i = Object.assign(i, obj);
				return i;
			})
		},
	}	
}

/**
 * @param {{ kelp: number; sand: number; wood: number; }} info
 */
function allGensCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		/**
		 * @param {string | number} type
		 * @param {any} amt
		 */
		setgen(type, amt) {
			update(i => {
	      		i[type] = amt;
	      		return i;
      		})
		},
		updateAll() {
			update(i => {
				i = {};
				let b = Object.entries(get(builds))
				let cts = get(buildCounts);
				let hasRes = true;
				for (let k of b) {
					let curr = k[1];
					if (curr['subtracts']) {
						for (let x of Object.entries(curr['subtracts'])) {
							if (get(res)[x[0]][3] == 1) {
								hasRes = false;
							}
						}
					}
					// https://stackoverflow.com/questions/67390960/javascript-how-to-merge-two-objects-and-sum-the-values-of-the-same-key
					// let next = Object.entries(i).reduce((acc, [key, value]) => 
				 //  ({ ...acc, [key]: (acc[key] || 0) + (value*curr['count'])}), { ...curr['gens'] });
					for (let [ck, cv] of Object.entries(curr['gens'])) {
						
					
						if (curr['toggleable'] && hasRes) {
							i[ck] = (i[ck] || 0) + cv*cts[k[0]][1]*resDeltas.getTotalBonus(k)
						} else if (hasRes) {
							i[ck] = (i[ck] || 0) + cv*cts[k[0]][0]*resDeltas.getTotalBonus(k)
						}
					}
				}
				return i;
			})
		}
	}
}

/**
 * @param {{ kelp: number; sand: number; wood: number; }} info
 */
function allBonusCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		/**
		 * @param {string | number} type
		 * @param {any} amt
		 */
		setgen(type, amt) {
			update(i => {
	      		i[type] = amt;
	      		return i;
      		})
		},
		updateAll() {
			update(i => {
				i = {};
				let b = Object.entries(get(builds))
				let cts = get(buildCounts);
				let hasRes = true;
				for (let k of b) {
					let curr = k[1];
					if (curr['subtracts']) {
						for (let x of Object.entries(curr['subtracts'])) {
							if (get(res)[x[0]][3] == 1) {
								hasRes = false;
								break;
							}
						}
					}
					// https://stackoverflow.com/questions/67390960/javascript-how-to-merge-two-objects-and-sum-the-values-of-the-same-key
					// let next = Object.entries(i).reduce((acc, [key, value]) => 
				 //  ({ ...acc, [key]: (acc[key] || 0) + (value*curr['count'])}), { ...curr['gens'] });
				 if (curr['bonuses'] !== undefined && hasRes) {
				 	// console.log(curr)
				 	// console.log(k);
					for (let [ck, cv] of Object.entries(curr['bonuses'])) {
						if (curr['toggleable'] && hasRes) {
							i[ck] = (i[ck] || 0) + cv*cts[k[0]][1];
						} else if (hasRes) {
							i[ck] = (i[ck] || 0) + cv*cts[k[0]][0];
						}
					}
				}
			}
			return i;
			})
		},
	}
}

/**
 * @param {{ kelp: number; sand: number; wood: number; }} info
 */
 function allSubtractsCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		/**
		 * @param {string | number} type
		 * @param {any} amt
		 */
		setgen(type, amt) {
			update(i => {
	      		i[type] = amt;
	      		return i;
      		})
		},
		updateAll() {
			update(i => {
				i = {};
				let b = Object.entries(get(builds))
				let cts = get(buildCounts);
				for (let k of b) {
					let curr = k[1];
					// https://stackoverflow.com/questions/67390960/javascript-how-to-merge-two-objects-and-sum-the-values-of-the-same-key
					// let next = Object.entries(i).reduce((acc, [key, value]) => 
				 //  ({ ...acc, [key]: (acc[key] || 0) + (value*curr['count'])}), { ...curr['gens'] });
					for (let [ck, cv] of Object.entries(curr['subtracts'])) {
						if (curr['toggleable']) {
							i[ck] = (i[ck] || 0) + cv*cts[k[0]][1];
						} else {
							i[ck] = (i[ck] || 0) + cv*cts[k[0]][0];
						}
					}
				}
				return i;
			})
		}
	}
}

function resDeltasCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		/**
		 * @param {string | number} type
		 * @param {any} amt
		 */
		setgen(type, amt) {
			update(i => {
	      		i[type] = amt;
	      		return i;
      		})
		},
		getTotalBonus(k) { 
			const gloryBonus = fm.calcGloryBonusProduction(get(fameTab)['gloryLevel'])
			const multi = (1+(get(policyBonuses)[k[0].toLowerCase()] || 0)) // policy bonus
			* (1+(get(policyBonuses)['global'] || 0))// multiplicative global bonus
			* (1 + (k[1]['toggleable'] ? get(policyBonuses)['toggle'] || 0 : 0)) // multiplicative toggle bonus, if applicable
			* (1+(gloryBonus*0.05)); // add in glory bonus 
			return multi;
		},
		updateAll() {
			update(i => {
				i = {};
				let b = Object.entries(get(builds))
				let cts = get(buildCounts);
				let hasRes = true;
				

				for (let k of b) {
					hasRes = true;
					// get info of current building
					let curr = k[1];
					// https://stackoverflow.com/questions/67390960/javascript-how-to-merge-two-objects-and-sum-the-values-of-the-same-key
					
					if (curr['subtracts']) {
						for (let x of Object.entries(curr['subtracts'])) {
							if (get(res)[x[0]][3] == 1) {
								hasRes = false;
							}
						}
					}

					// add generation
					for (let [ck, cv] of Object.entries(curr['gens'])) {
						if (curr['toggleable'] && hasRes) {
							i[ck] = ((i[ck] || 0) + cv*cts[k[0]][1])*this.getTotalBonus(k)
						} else if (hasRes) {
							i[ck] = ((i[ck] || 0) + cv*cts[k[0]][0])*this.getTotalBonus(k)
						}
					}
					// subtract consumption
					for (let [ck, cv] of Object.entries(curr['bonuses'])) {
						if (curr['toggleable'] && hasRes) {
							i[ck] *= (1 + (cv/100)*cts[k[0]][1]);
						} else if (hasRes) {
							i[ck] *= (1 + (cv/100)*cts[k[0]][0]);
						}
					}
					for (let [ck, cv] of Object.entries(curr['subtracts'])) {
						if (curr['toggleable']) {
							i[ck] = (i[ck] || 0) - cv*cts[k[0]][1];
						} else {
							i[ck] = (i[ck] || 0) - cv*cts[k[0]][0];
						}
					}
					// multiply by building bonuses
					// multiply by policy bonuses
					for (let [ck, cv] of Object.entries(get(allPolicies))) {
							i[ck] *= (1 + (cv/100) || 1);
						}
					}

				return i;
			})
		}
	}
}

export const builds = buildings({
	'kelp farm': {
		id: 0,
		name: 'Kelp Farm',
		description: 'Harvests some kelp from the... void? Look, this isn\'t supposed to be hyper-realistic.',
		costs: {
			kelp: 20
		},
		ratio: 1.15,
		gens: {
			kelp: 0.2
		},
		bonuses: {},
		subtracts: {},
		caps: {},
		toggleable: false,
		available: true,
		criteria: [],
		
	},
	'pasture': {
		id: 1,
		name: 'Pasture',
		description: 'Significantly increases kelp production.',
		costs: {
			copper: 10,
			iron: 10
		},
		ratio: 1.12,
		gens: {
		},
		caps: {},
		bonuses: {
			kelp: 8.5
		},
		subtracts: {},
		toggleable: false,
		available: true,
		criteria: ['agriculture'],
		
	},
	'sand nets': {
		id: 2,
		name: 'Sand Nets',
		description: 'Catches sand and twigs from the sea floor.',
		costs: {
			kelp: 100
		},
		ratio: 1.25,
		gens: {
			sand: 0.012,
			wood: 0.004
		},
		caps: {},
		bonuses: {},
		subtracts: {},
		toggleable: false,
		
		criteria: [],
		
	},
	'study': { 
		id: 3,
		name: 'Study',
		description: 'The study allows turtles to converse and theorize about new scientific knowledge.',
		costs: {
			sand: 15,
		},
		ratio: 1.25,
		gens: {
			science: 0.03
		},
		bonuses: {},
		subtracts: {},
		caps: {
			science: 100,
		},
		toggleable: false,
		
		criteria: [],
		
	},
	'silo': {
		id: 4,
		name: 'Silo',
		description: 'A place for your turtles to store excess stuff.',
		costs: {
			sand: 10,
			wood: 1
		},
		ratio: 1.75,
		gens: {

		},
		bonuses: {},
		subtracts: {},
		caps: {
			kelp: 300,
			sand: 100,
			wood: 100,
			copper: 50
		},
		toggleable: false,
		
		criteria: [],
		

	},
	'mill': {
		id: 5,
		name: 'Mill',
		description: 'A grinder for large rocks and twigs, the mill increases sand and wood output. Also dredges up some copper from time to time.',
		costs: {
			sand: 40,
			wood: 10
		},
		ratio: 1.15,
		gens: {
			copper: 0.002
		},
		caps: {
		},
		bonuses: {
			sand: 15,
			wood: 15,
		},
		subtracts: {},
		toggleable: false,
		
		criteria: ['infrastructure'],
		

	},
	'furnace': {
		id: 6,
		name: 'Furnace',
		description: 'Furnaces allow for a revolutionary increase in metal-producing power, at the cost of burnable materials.',
		costs: {
			sand: 300,
			copper: 75
		},
		ratio: 1.15,
		gens: {
			copper: 0.15,
			iron: 0.006,
			coal: 0.006,
		},
		caps: {
		},
		bonuses: {
		},
		subtracts: {
			kelp: 1.5,
			wood: 0.04
		},
		toggleable: true,
		
		criteria: ['heat'],
		

	},
	'statue': {
		id: 7,
		name: 'Statue',
		description: 'Turtles have big egos; statues will let visitors know who\'s the best.',
		costs: {
			sand: 600,
			wood: 100
		},
		ratio: 1.25,
		gens: {
			fame: 0.0002
		},
		caps: {
		},
		bonuses: {
		},
		subtracts: {},
		toggleable: false,
		
		criteria: ['writing'],
		
	},
	'observatory': {
		id: 8,
		name: 'Observatory',
		description: 'Observatories allow turtles additional availability to record movement of the stars, increasing scientific effectiveness.',
		costs: {
			iron: 110
		},
		ratio: 1.18,
		gens: {
		},
		caps: {
			science: 500
		},
		bonuses: {
			science: 30
		},
		subtracts: {},
		toggleable: false,
		
		criteria: ['basic mathematics'],
		
	},
	'storehouse': {
		id: 9,
		name: 'Storehouse',
		description: 'Dramatically increases storage capability, enabling more advanced structures.',
		costs: {
			wood: 200,
			copper: 200,
			iron: 25
		},
		ratio: 1.18,
		gens: {
		},
		caps: {
			kelp: 1000,
			sand: 750,
			wood: 750,
			copper: 300,
			iron: 200,
			coal: 200
		},
		bonuses: {
		},
		subtracts: {},
		toggleable: false,
		
		criteria: ['basic mathematics'],
		
	},
	'town hall': {
		id: 10,
		name: 'Town Hall',
		description: 'Unlocks many new upgrades and produces luxury currency. Can be significantly improved later.',
		costs: {
			wood: 750,
			copper: 750,
			fame: 100
		},
		ratio: 3,
		gens: {
			gold: 0.0004,
			favor: 0.15
		},
		caps: {
			gold: 25,
			favor: 10
		},
		bonuses: {
		},
		subtracts: {},
		toggleable: false,
		
		criteria: ['government'],
		
	},
	'crypt': {
		id: 11,
		name: 'Crypt',
		description: 'Wonder what\'s inside...',
		costs: {
			iron: 666,
			gold: 111
		},
		ratio: 1.25,
		gens: {
			magic: 0.02
		},
		caps: {},
		bonuses: {
			gold: 6.66
		},
		subtracts: {},
		toggleable: false,
		
		criteria: ['wizardry', 'basic mathematics'],
		
	},

})


export const allGens = allGensCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

// everything is in (percent - 100)
export const allBonuses = allBonusCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

export const allSubtracts = allSubtractsCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

export const resDeltas = resDeltasCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

export const baseAllGens = allGensCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

export const baseAllBonuses = allGensCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

// policy bonuses are still in %, but multiplicative with everything else
export const allPolicies = allBonusCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

export const baseAllPolicies = allBonusCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

export const buildCounts = buildingCountCreator({
	'0': [0,0],
	'1': [0,0],
})

export const baseBuildCounts = buildingCountCreator({
	'0': 0,
	'1': 0
})
