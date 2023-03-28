// @ts-nocheck
import {get, writable} from 'svelte/store'
import {builds, buildCounts, allGens, allBonuses} from './buildings.js'
import { science} from './science.js';
import {res, policyBonuses, policyTab, visible, researched} from './player.js'
/**
 * @param {{ 0: { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; 
// the IDs of the policy prerequisites to unlock this one (check README)
criteria: never[]; } | { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; 
// the IDs of the policy prerequisites to unlock this one (check README)
criteria: never[]; }; 1: { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; }; 2: { id: number; name: string; description: string; costs: { policy: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; }; 3: { id: number; name: string; description: string; costs: { policy: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; }; 4: { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; }; 5: { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; }; 6: { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; }; 7: { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; }; 8: { id: number; name: string; description: string; costs: { policy: number; fame: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; fame: number; }; researched: boolean; available: boolean; criteria: number[]; }; 9: { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; }; 10: { id: number; name: string; description: string; costs: { policy: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; }; 11: { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { policy: number; }; researched: boolean; available: boolean; criteria: number[]; }; }} info
 */
function policyCreator(info) {
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
		lockAll() {
			update(i => {
				for (let k of Object.entries(i)) {
					console.log(k);
					k[1]['researched'] = false;
					k[1]['available'] = false;
				}
				i['0']['available'] = true;
				return i;
			})
		},
		checkCriteria() {
			update(i => {
				for (let b of Object.entries(i)) {
					let isSatisfied = true;
					for (let req of b[1]['criteria']) {
						
						if (!(get(researched)['policy'].has(req.toString()))) {
							isSatisfied = false;
							visible.setRem(b[0], 'policy')
							break;
						}

					}
					if (isSatisfied) {
						visible.setAdd(b[0], 'policy')
					}
				}
				return i;
			})
		},
		setPoliciesResearched() {
			// note: these are not ALL of the bonuses
			// bonuses that affect other areas will be in other sections
			// this is used for onMount() primarily
			let r = 0;
			for (let i of Object.values(get(policyTab)['policiesResearched'])) {
				if (i['researched']) r++;
			}
			policyTab.set('policiesResearched', r);
			
		},
		// gets total number of policies researched
		getPnum() {
			return get(policyTab)['policiesResearched'] 

		},	
		/**
		 * @param {string | number} sci
		 */
		updateAll(sci) {
			update (i => {
				policyBonuses.setSelf({});
				for (let [key, val] of Object.entries(i)) {
					if (get(researched)['policy'].has(key)) {
						for (let [k, v] of Object.entries(val['bonuses'])) {
							policyBonuses.add(k.toLowerCase(), (policyBonuses[k.toLowerCase()] || 0) + v);
						}
					}
				}
				console.log(get(policyBonuses))
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
		      			i[type] = i[type] + amt
		      			return i;
     		
		     })
		},
		setItem(type, amt) {
			update(i => {
				i[type] = amt;
				return i;
			})
		},
		setSelf(obj) {
			update (i => {
				i = obj;
				return i;
			})
		},
	};
}


export const policy = policyCreator({
	0: {
		id: 0,
		// name of the building + tier of policy
		code: "kelp farm 1",
		name: 'Fertilizer I',
		description: 'Using a mysterious substance, your kelp farms can be drastically improved.',
		costs: {
			science: 800,
			favor: 10
		},
		bonuses: {
			'kelp farm': 0.75
		},
		criteria: []
	},
	1: {
		id: 1,
		// name of the building + tier of policy
		code: "kelp farm 2",
		name: 'Fertilizer II',
		description: 'Improve the quality of fertilizer, increasing kelp production.',
		costs: {
			science: 35000,
			favor: 55
		},
		bonuses: {
			'kelp farm': 0.75
		},
		criteria: [0]
	},
	2: {
		id: 2,
		// name of the building + tier of policy
		code: "kelp farm 3",
		name: 'Fertilizer III',
		description: 'With drastic advancements in soil micronutrients, your turtles\' fertilizer has become absurdly effective.',
		costs: {
			science: 225000,
			favor: 90
		},
		bonuses: {
			'kelp farm': 0.9
		},
		criteria: [1]
	},
	3: {
		id: 3,
		// name of the building + tier of policy
		code: "kelp farm 4",
		name: 'Fertilizer IV',
		description: 'Do you even NEED this much kelp?',
		costs: {
			science: 2.4e6,
			favor: 140
		},
		bonuses: {
			'kelp farm': 1.25
		},
		criteria: [2]
	},
	4: {
		id: 4,
		// name of the building + tier of policy
		code: "kelp farm 5",
		name: 'Fertilizer V',
		description: 'I mean come on, this is just ridiculous.',
		costs: {
			science: 6e7,
			favor: 200
		},
		bonuses: {
			'kelp farm': 1.25
		},
		criteria: [3]
	},
	100: {
		id: 100,
		// name of the building + tier of policy
		code: "sand net 1",
		name: 'Iron Nets',
		description: 'The stronger nets make a big difference!',
		costs: {
			science: 1900,
			iron: 525,
			favor: 10
		},
		bonuses: {
			'sand nets': 0.35,
			'kelp farm': 0.10
		},
		criteria: []
	},
	101: {
		id: 101,
		// name of the building + tier of policy
		code: "sand net 1",
		name: 'Alloyed Nets',
		description: 'Even more robust nets lead to an unprecedented jump in productivity, in many ways!',
		costs: {
			science: 25000,
			iron: 4000,
			copper: 4000,
			gold: 250,
			favor: 45
		},
		bonuses: {
			'sand nets': 0.9,
			'mill': 0.25
		},
		criteria: [100]
	},
	102: {
		id: 102,
		// name of the building + tier of policy
		code: "sand net 1",
		name: 'Steel Nets',
		description: 'Incredible innovations in woven fabric allow steel to be directly integrated with cloth!',
		costs: {
			science: 25000,
			iron: 4000,
			copper: 4000,
			gold: 250,
			favor: 90
		},
		craftCosts: {
			plank: 425
		},
		bonuses: {
			'sand nets': 0.9,
			'mill': 0.25
		},
		criteria: [101]
	},
	200: {
		id: 200,
		// name of the building + tier of policy
		code: "pasture 1",
		name: 'Greener Pastures I',
		description: 'Your cow-- uh, turtles. Your TURTLES will love it.',
		costs: {
			science: 2300,
			favor: 10
		},
		bonuses: {
			'pasture': 0.25
		},
		criteria: []
	},
	300: {
		id: 300,
		// name of the building + tier of policy
		code: "study 1",
		name: 'Updated Literature I',
		description: 'We replaced all the first-edition textbooks with second-edition ones.',
		costs: {
			science: 2800,
			fame: 400,
			favor: 10
		},
		bonuses: {
			'study': 0.3
		},
		criteria: []
	},
	400: {
		id: 400,
		// name of the building + tier of policy
		code: "mill 1",
		name: 'Strong Grinders I',
		description: 'These bad boys can crush anything in sight!',
		costs: {
			science: 3250,
			iron: 2700,
			favor: 10
		},
		craftCosts: {
			plank: 15
		},
		bonuses: {
			'mill': 0.15
		},
		criteria: []
	},
	500: {
		id: 500,
		// name of the building + tier of policy
		code: "furnace 1",
		name: 'Blast Furnace I',
		description: 'Higher temperatures increase the efficacy of metal-smelting.',
		costs: {
			science: 3600,
			copper: 1200,
			favor: 10
		},
		craftCosts: {
			tinder: 20
		},
		bonuses: {
			'furnace': 0.04
		},
		criteria: [100]
	},
	600: {
		id: 600,
		// name of the building + tier of policy
		code: "statue 1",
		name: 'Golden Trim I',
		description: 'More prestige, more!',
		costs: {
			science: 4000,
			gold: 80,
			favor: 10
		},
		bonuses: {
			'statue': 2.50
		},
		criteria: [200]
	},
	601: {
		id: 601,
		// name of the building + tier of policy
		code: "statue 2",
		name: 'Golden Trim II',
		description: 'It\'s so shiny...,',
		costs: {
			science: 46500,
			gold: 1000,
			favor: 75
		},
		bonuses: {
			'statue': 1.50
		},
		criteria: [600]
	},
	700: {
		id: 700,
		// name of the building + tier of policy
		code: "observatory 1",
		name: 'Stronger Magnification',
		description: '',
		costs: {
			science: 8000,
			favor: 25
		},
		bonuses: {
			'observatory': 0.25
		},
		criteria: [200]
	},
	800: {
		id: 800,
		// name of the building + tier of policy
		code: "town hall 1",
		name: 'Town Hall I',
		description: '[placeholder]',
		costs: {
			science: 7000,
			favor: 75
		},
		bonuses: {
			'town hall': 0.33
		},
		criteria: [300]
	},
	900: {
		id: 900,
		// name of the building + tier of policy
		code: "oil well 1",
		name: 'Oil Well I',
		description: '[placeholder]',
		costs: {
			science: 8000,
			oil: 100,
			favor: 25
		},
		bonuses: {
			'oil well': 0.3
		},
		criteria: [400]
	},
	1000: {
		id: 1000,
		// name of the building + tier of policy
		code: "temple 1",
		name: 'Temple I',
		description: '[placeholder]',
		costs: {
			science: 900,
			karma: 5000,
			favor: 30
		},
		bonuses: {
			'town hall': 0.33
		},
		criteria: [500]
	},
	1100: {
		id: 1100,
		// name of the building + tier of policy
		code: "blast heater 1",
		name: 'Blast Heater I',
		description: '[placeholder]',
		costs: {
			science: 9000,
			favor: 30
		},
		bonuses: {
			'blast heater': 0.075
		},
		criteria: [500]
	},
	1200: {
		id: 1200,
		// name of the building + tier of policy
		code: "treasury 1",
		name: 'Treasury I',
		description: '[placeholder]',
		costs: {
			science: 10000,
			favor: 35
		},
		bonuses: {
			'treasury': 0.125
		},
		criteria: [600]
	},
	10000: {
		id: 10000,
		// name of the building + tier of policy
		code: "storehouse 1",
		name: 'Storehouse I',
		description: '[placeholder]',
		costs: {
			science: 3500,
			favor: 30
		},
		bonuses: {
			'storehouse': 0.15
		},
		updateCap: true, // if cap needs to be updated 
		criteria: []
	},
	10001: {
		id: 10001,
		// name of the building + tier of policy
		code: "storehouse 2",
		name: 'Storehouse II',
		description: '[placeholder]',
		costs: {
			science: 30000,
			favor: 110
		},
		bonuses: {
			'storehouse': 0.25
		},
		updateCap: true, // if cap needs to be updated 
		criteria: [10000]
	},



	99900: {
		id: 99900,
		// name of the building + tier of policy
		code: "global 1",
		name: 'Efficiency I',
		description: 'Turtles on overdrive.',
		costs: {
			science: 10000,
			favor: 25
		},
		bonuses: {
			'global': 0.04
		},
		updateCap: true,
		criteria: []
	},
	99901: {
		id: 99901,
		// name of the building + tier of policy
		code: "global 1",
		name: 'Efficiency II',
		description: 'Never stop. Keep grinding.',
		costs: {
			science: 240000,
			favor: 90
		},
		bonuses: {
			'global': 0.06
		},
		updateCap: true,
		criteria: [99900]
	},
	99902: {
		id: 99902,
		// name of the building + tier of policy
		code: "global 1",
		name: 'Efficiency III',
		description: 'Going past this point may cause some... unexpected consequences.',
		costs: {
			science: 5e6,
			favor: 210
		},
		bonuses: {
			'global': 0.10
		},
		updateCap: true,
		criteria: [99901]
	},

})









