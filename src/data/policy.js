// @ts-nocheck
import {get, writable} from 'svelte/store'
import {builds, buildCounts, allGens, allBonuses} from './buildings.js'
import { science, baseScience } from './science.js';
import {res, policyBonuses, policyTab} from './player.js'
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
					for (let sci of b[1]['criteria']) {
						if (get(science)[sci]['researched'] == false) {
							isSatisfied = false;
						}

					}
					if (isSatisfied === true) {
						b[1]['available'] = true;
					}
				}
				return i;
			})
		},
		applyMilestoneBonuses() {
			// note: these are not ALL of the bonuses
			// bonuses that affect other areas will be in other sections
			// this is used for onMount() primarily
			const val = get(policyTab)['policiesResearched']
			
		},
		// gets total number of policies researched
		getPnum() {
			return get(policyTab)['policiesResearched']
		},	
		/**
		 * @param {string | number} sci
		 */
		updateSpecialCase(sci) {
			update (i => {
				console.log(i[sci]['id'])
				switch (i[sci]['id'].toString()) {
			      // Case number is the string of the policy ID in README
			      // Construction increases study effectiveness
			    	case '0':
				        builds.updateItemValue(2, 'gens', {
				          copper: 0.005
				        }); 
				        builds.updateItemValue(2, 'caps', {
				          copper: 100
				        });     
				        allGens.updateAll();
				        break;
			      	case '3':
				        builds.updateItemValue(3, 'caps', {
				          policy: get(builds)[3]['caps']['policy'] + 150
				        });
				        builds.updateItemValue(3, 'gens', {
				          policy: get(builds)[3]['gens']['policy']*1.3
				        });
				        builds.updateItemValue(2, 'gens', {
				          wood: get(builds)[2]['gens']['wood']*1.5
				        });
				        res.addCap('policy', 150*get(buildCounts)[2][0]) // 2 as the ID for studies
				        allGens.updateAll();
				        console.log(get(builds)[1])
			        	break;
					case '10':
						builds.updateItemValue(2, 'gens', {
							wood: get(builds)[2]['gens']['wood']*2.30
						});
						builds.updateItemValue(2, 'gens', {
							sand: get(builds)[2]['gens']['sand']*2
						})
			      	default:
			        	break;
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
	'Fertilizer': {
		id: 0,
		// name of the building + tier of policy
		code: "kelp farm 1",
		name: 'Fertilizer',
		description: 'Using a mysterious substance, your kelp farms can be drastically improved.',
		costs: {
			science: 800
		},
		bonuses: {
			'Kelp Farm': 0.75
		},
		researched: false,
		available: false,
		criteria: []
	},
	'Iron Nets': {
		id: 1,
		// name of the building + tier of policy
		code: "sand net 1",
		name: 'Iron Nets',
		description: 'The stronger nets make a big difference!',
		costs: {
			science: 1900,
			iron: 525
		},
		bonuses: {
			'Sand Nets': 0.35,
			'Kelp Farm': 0.10
		},
		researched: false,
		available: false,
		criteria: []
	},
	'Alloyed Nets': {
		id: 2,
		// name of the building + tier of policy
		code: "sand net 1",
		name: 'Alloyed Nets',
		description: 'Even more robust nets lead to an unprecedented jump in productivity, in many ways!',
		costs: {
			science: 25000,
			iron: 4000,
			copper: 4000,
			gold: 250
		},
		bonuses: {
			'Sand Nets': 0.9,
			'Mill': 0.25
		},
		researched: false,
		available: false,
		criteria: [1]
	},

})

export const basePolicy = policyCreator({
	'Fertilizer': {
		id: 0,
		// name of the building + tier of policy
		code: "kelp farm 1",
		name: 'Fertilizer',
		description: 'Using a mysterious substance, your kelp farms can be drastically improved.',
		costs: {
			science: 800
		},
		bonuses: {
			'Kelp Farm': 0.75
		},
		researched: false,
		available: false,
		criteria: []
	},
	'Iron Nets': {
		id: 1,
		// name of the building + tier of policy
		code: "sand net 1",
		name: 'Iron Nets',
		description: 'The stronger nets make a big difference!',
		costs: {
			science: 1900,
			iron: 525
		},
		bonuses: {
			'Sand Nets': 0.35,
			'Kelp Farm': 0.10
		},
		researched: false,
		available: false,
		criteria: []
	},
	'Alloyed Nets': {
		id: 2,
		// name of the building + tier of policy
		code: "sand net 1",
		name: 'Alloyed Nets',
		description: 'Even more robust nets lead to an unprecedented jump in productivity, in many ways!',
		costs: {
			science: 25000,
			iron: 4000,
			copper: 4000,
			gold: 250
		},
		bonuses: {
			'Sand Nets': 0.9,
			'Mill': 0.25
		},
		researched: false,
		available: false,
		criteria: [1]
	},

})







