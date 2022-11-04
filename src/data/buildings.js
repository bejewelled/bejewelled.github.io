import {get, writable} from 'svelte/store'
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

export const builds = buildings({
	'0': {
		id: 0,
		name: 'Kelp Farm',
		description: 'Harvests some kelp from the... void? Look, this isn\'t supposed to be hyper-realistic.',
		count: 0,
		costs: {
			kelp: 20
		},
		ratio: 1.15,
		gens: {
			kelp: 0.2
		},
		caps: {}
	},
	'1': {
		id: 1,
		name: 'Sand Nets',
		description: 'Catches sand and twigs from the sea floor.',
		count: 0,
		costs: {
			kelp: 250
		},
		ratio: 1.25,
		gens: {
			sand: 0.007,
			wood: 0.0009
		},
		caps: {}
	},
	'2': {
		id: 2,
		name: 'Study',
		description: 'The beginning of your turtles\' scientific domination.',
		count: 0,
		costs: {
			sand: 15,
			wood: 5
		},
		ratio: 1.25,
		gens: {
			science: 0.002
		},
		caps: {}
	},
	'3': {
		id: 3,
		name: 'Silo',
		description: 'A place for your turtles to store excess stuff.',
		count: 0,
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
		}
	},
})

export const allGens = allGensCreator({
	kelp: 0,
	sand: 0,
	wood: 0
})

export const buildCounts = buildingCountCreator({
	'0': 0,
	'1': 1
})