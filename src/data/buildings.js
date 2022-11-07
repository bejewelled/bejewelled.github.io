import {get, writable} from 'svelte/store'
import {science} from './science.js'
import {res} from './player.js'
function buildings(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		add(id, amt) {
			update(i => {
	      		buildCounts[id] += amt;
	      		return i;
      		})
		},
		setSelf(obj) {
			update(i => {
				i = obj;
				return i;
			})
		},
		setItemVal(id, key, val) {
			update(i => {
				i[id][key] = val;
			})
			return i;
		},
		checkSciCriteria() {
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
		checkResUnlockThreshold(id) {
			update(i => {
				for (let c of Object.entries(i[id]['costs'])) {
					if (i[id]['visible'] == false && get(res)[c[0]][0] > 0.2*c[1]) {
						i[id]['visible'] = true;
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

function buildingCountCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		init(len) {
			update(i => {
				for(let c = 0; c < len; c++) {
					i[c.toString()] = 0;
				}
				return i;
			})
		},
		add(id, amt) {
			update(i => {
				i[id] += amt;
				return i;
			})
		},
		setSelf(obj) {
			update(i => {
				i = obj;
				return i;
			})
		}
	}	
}

function allGensCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
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
					for (let [ck, cv] of Object.entries(curr['gens'])) {
						i[ck] = (i['ck'] || 0) + cv*cts[k[0]];
					}
				}
				return i;
			})
		}
	}
}

function allBonusCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
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
				 if (curr['bonuses'] !== undefined) {
					for (let [ck, cv] of Object.entries(curr['bonuses'])) {
						i[ck] = (i['ck'] || 0) + cv*cts[k[0]];
					}
				}
				console.log(i)
			}
			return i;
			})
		},
	}
}

export const builds = buildings({
	'0': {
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
		caps: {},
		available: true,
		criteria: [],
		visible: false
	},
	'1': {
		id: 1,
		name: 'Sand Nets',
		description: 'Catches sand and twigs from the sea floor.',
		costs: {
			kelp: 250
		},
		ratio: 1.25,
		gens: {
			sand: 0.012,
			wood: 0.00025
		},
		caps: {},
		available: false,
		criteria: [],
		visible: false
	},
	'2': {
		id: 2,
		name: 'Study',
		description: 'The beginning of your turtles\' scientific domination.',
		costs: {
			sand: 15,
		},
		ratio: 1.25,
		gens: {
			science: 0.009
		},
		caps: {},
		available: false,
		criteria: [],
		visible: false
	},
	'3': {
		id: 3,
		name: 'Silo',
		description: 'A place for your turtles to store excess stuff.',
		costs: {
			sand: 6,
			wood: 1
		},
		ratio: 1.75,
		gens: {

		},
		caps: {
			kelp: 150,
			sand: 30,
			wood: 30
		},
		available: false,
		criteria: [],
		visible: false

	},
	'4': {
		id: 4,
		name: 'Lumber Mill',
		description: 'A novel building that increases the output of woodcutting operations.',
		costs: {
			sand: 130,
			wood: 10
		},
		ratio: 1.15,
		gens: {

		},
		caps: {
		},
		bonuses: {
			wood: 10
		},
		available: false,
		criteria: [0],
		visible: false

	},
})

export const baseBuilds = buildings({
	'0': {
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
		caps: {},
		available: true,
		criteria: [],
		visible: false
	},
	'1': {
		id: 1,
		name: 'Sand Nets',
		description: 'Catches sand and twigs from the sea floor.',
		costs: {
			kelp: 250
		},
		ratio: 1.25,
		gens: {
			sand: 0.012,
			wood: 0.00025
		},
		caps: {},
		available: false,
		criteria: [],
		visible: false
	},
	'2': {
		id: 2,
		name: 'Study',
		description: 'The beginning of your turtles\' scientific domination.',
		costs: {
			sand: 15,
		},
		ratio: 1.25,
		gens: {
			science: 0.009
		},
		caps: {},
		available: false,
		criteria: [],
		visible: false
	},
	'3': {
		id: 3,
		name: 'Silo',
		description: 'A place for your turtles to store excess stuff.',
		costs: {
			sand: 6,
			wood: 1
		},
		ratio: 1.75,
		gens: {

		},
		caps: {
			kelp: 150,
			sand: 30,
			wood: 30
		},
		available: false,
		criteria: [0],
		visible: false

	},
	'4': {
		id: 4,
		name: 'Lumber Mill',
		description: 'A novel building that increases the output of woodcutting operations.',
		costs: {
			sand: 130,
			wood: 10
		},
		ratio: 1.15,
		gens: {

		},
		caps: {
		},
		bonuses: {
			wood: 10
		},
		available: false,
		criteria: [0],
		visible: false

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

export const baseAllGens = allGensCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

export const buildCounts = buildingCountCreator({
	'0': 0,
	'1': 0
})

export const baseBuildCounts = buildingCountCreator({
	'0': 0,
	'1': 0
})
