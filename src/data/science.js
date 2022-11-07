import {get, writable} from 'svelte/store'
function scienceCreator(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		unlock(id) {
			update(i => {
	      		i[id]['researched'] = true;
	      		return i;
      		})
		},
		lock(id) {
			update(i => {
	      		i[id]['researched'] = false;
	      		return i;
      		})
		},
		setSelf(obj) {
			update(i => {
				i = obj;
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
				console.log(i);
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
		getSelf() {
			update(i => {
				return i;
			})
		}
	}
}


export const science = scienceCreator({
	'0': {
		id: 0,
		name: 'Infrastructure',
		description: 'The building blocks for a prosperous civilization.',
		costs: {
			science: 30
		},
		researched: false,
		available: true,
		// the IDs of the science prerequisites to unlock this one (check README)
		criteria: []
	},
	'1': {
		id: 1,
		name: 'Language',
		description: 'How can your turtles do anything without language?',
		costs: {
			science: 75
		},
		researched: false,
		available: false,
		criteria: [0]
	},
	'2': {
		id: 2,
		name: 'Mining',
		description: 'Extract those precious, precious minerals.',
		costs: {
			science: 120
		},
		researched: false,
		available: false,
		criteria: [0]
	},
	'3': {
		id: 3,
		name: 'Construction',
		description: 'Enables more advanced structures.',
		costs: {
			science: 200
		},
		bonuses: [
			{label: 'Study science cap: ', val: '+150'}
		],
		researched: false,
		available: false,
		criteria: [1]
	},
	'4': {
		id: 4,
		name: 'Writing',
		description: 'Cornerstone of any civilized population. Increases study effectiveness and unlocks new ways to expand cultural development.',
		costs: {
			science: 325
		},
		bonuses: [
			'Study science cap: +150'
		],
		researched: false,
		available: false,
		criteria: [1]
	},
	'5': {
		id: 5,
		name: 'Taming',
		description: 'Your turtles have learned a way to domesticate their prey instead of eating it.',
		costs: {
			science: 500
		},
		researched: false,
		available: false,
		criteria: [2]
	},
	'6': {
		id: 6,
		name: 'Recordkeeping',
		description: 'Recordkeeping opens a wide door to turtle civilization, including specialized labor.',
		costs: {
			science: 750
		},
		researched: false,
		available: false,
		criteria: [4]
	},
	'7': {
		id: 7,
		name: 'Heat',
		description: 'Wielding heat in harsh underwater conditions is crucial for wielding newly discovered metals.',
		costs: {
			science: 750
		},
		researched: false,
		available: false,
		criteria: [3]
	},

})

export const baseScience = scienceCreator({
	'0': {
		id: 0,
		name: 'Infrastructure',
		description: 'The building blocks for a prosperous civilization.',
		costs: {
			science: 30
		},
		researched: false,
		available: true,
		// the IDs of the science prerequisites to unlock this one (check README)
		criteria: []
	},
	'1': {
		id: 1,
		name: 'Language',
		description: 'How can your turtles do anything without language?',
		costs: {
			science: 75
		},
		researched: false,
		available: false,
		criteria: [0]
	},
	'2': {
		id: 2,
		name: 'Mining',
		description: 'Extract those precious, precious minerals.',
		costs: {
			science: 120
		},
		researched: false,
		available: false,
		criteria: [0]
	},
	'3': {
		id: 3,
		name: 'Construction',
		description: 'Enables more advanced structures.',
		costs: {
			science: 200
		},
		researched: false,
		available: false,
		criteria: [1]
	},
	'4': {
		id: 4,
		name: 'Writing',
		description: 'Without a codified writing system, progress will slow to a halt.',
		costs: {
			science: 325
		},
		researched: false,
		available: false,
		criteria: [1]
	},
	'5': {
		id: 5,
		name: 'Taming',
		description: 'Your turtles have learned a way to domesticate their prey instead of eating it.',
		costs: {
			science: 500
		},
		researched: false,
		available: false,
		criteria: [2]
	},
	'6': {
		id: 6,
		name: 'Recordkeeping',
		description: 'Recordkeeping opens a wide door to turtle civilization, including specialized labor.',
		costs: {
			science: 750
		},
		researched: false,
		available: false,
		criteria: [4]
	},
	'7': {
		id: 7,
		name: 'Heat',
		description: 'Wielding heat in harsh underwater conditions is crucial for wielding newly discovered metals.',
		costs: {
			science: 750
		},
		researched: false,
		available: false,
		criteria: [3]
	},



})
