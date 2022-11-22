import {get, writable} from 'svelte/store'
import {builds, buildCounts, allGens, allBonuses} from './buildings.js'
import {res} from './player.js'
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
		addNew(id, item) {
			update(i => {
				i[id] = item;
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
		updateSpecialCase(sci) {
			update (i => {
				console.log(i[sci]['id'])
				switch (i[sci]['id'].toString()) {
			      // Case number is the string of the science ID in README
			      // Construction increases study effectiveness
			    	case '2':
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
				          science: get(builds)[3]['caps']['science'] + 150
				        });
				        builds.updateItemValue(3, 'gens', {
				          science: get(builds)[3]['gens']['science']*1.3
				        });
				        builds.updateItemValue(2, 'gens', {
				          wood: get(builds)[2]['gens']['wood']*1.5
				        });
				        res.addCap('science', 150*get(buildCounts)[2][0]) // 2 as the ID for studies
				        allGens.updateAll();
				        console.log(get(builds)[1])
			        	break;
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
		description: 'Metal is the gateway to advanced infrastructure. Allows sand nets to capture copper.',
		costs: {
			science: 120
		},
		bonuses: [
			{label: 'Sand Nets copper production: ', val: '0.05/sec'},
			{label: 'Silo copper storage: ', val: '100'},
		],
		researched: false,
		available: false,
		criteria: [0]
	},
	'3': {
		id: 3,
		name: 'Construction',
		description: 'Enables more advanced structures; as a result, sand nets and studies are remodeled, increasing their effectiveness.',
		costs: {
			science: 200
		},
		bonuses: [
			{label: 'Study science cap: ', val: '+150'},
			{label: 'Study science production: ', val: '+30%'},
			{label: 'Sand Nets wood production: ', val: '+150%'},
		],
		researched: false,
		available: false,
		criteria: [1]
	},
	'4': {
		id: 4,
		name: 'Writing',
		description: 'Without a codified writing system, progress will slow to a halt. Writing not only increases internal productivity, but allows contact with others who may want to experience turtle civilization.',
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
	'8': {
		id: 8,
		name: 'Wizardry',
		description: '...',
		costs: {
			science: 10000,
			fame: 100
		},
		researched: false,
		available: false,
		criteria: [4,7]
	},
	'9': {
		id: 9,
		name: 'Agriculture',
		description: 'Agriculture allows for large-scale and organized farming.',
		costs: {
			science: 1200
		},
		researched: false,
		available: false,
		criteria: [6]
	},
	'10': {
		id: 10,
		name: 'Basic Mathematics',
		description: 'Numeric competency is required for advanced architectural and scientific pursuits.',
		costs: {
			science: 1200
		},
		researched: false,
		available: false,
		criteria: [6]
	},
	'11': {
		id: 11,
		name: 'Astronomy',
		description: 'Studying the stars isn\'t just for horoscopes; turtles can use the night sky for a variety of purposes.',
		costs: {
			science: 2000
		},
		researched: false,
		available: false,
		criteria: [6,9]
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
		description: 'Metal is the gateway to advanced infrastructure. Allows sand nets to capture copper.',
		costs: {
			science: 120
		},
		bonuses: [
			{label: 'Sand Nets copper production: ', val: '0.05/sec'},
			{label: 'Silo copper storage: ', val: '100'},
		],
		researched: false,
		available: false,
		criteria: [0]
	},
	'3': {
		id: 3,
		name: 'Construction',
		description: 'Enables more advanced structures; as a result, sand nets and studies are remodeled, increasing their effectiveness.',
		costs: {
			science: 200
		},
		bonuses: [
			{label: 'Study science cap: ', val: '+150'},
			{label: 'Study science production: ', val: '+30%'},
			{label: 'Sand Nets wood production: ', val: '+150%'},
		],
		researched: false,
		available: false,
		criteria: [1]
	},
	'4': {
		id: 4,
		name: 'Writing',
		description: 'Without a codified writing system, progress will slow to a halt. Writing not only increases internal productivity, but allows contact with others who may want to experience turtle civilization.',
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
	'8': {
		id: 8,
		name: 'Wizardry',
		description: '...',
		costs: {
			science: 10000,
			fame: 100
		},
		researched: false,
		available: false,
		criteria: [4,7]
	},
	'9': {
		id: 9,
		name: 'Agriculture',
		description: 'Agriculture allows for large-scale and organized farming.',
		costs: {
			science: 1200
		},
		researched: false,
		available: false,
		criteria: [6]
	},
	'10': {
		id: 10,
		name: 'Basic Mathematics',
		description: 'Numeric competency is required for advanced architectural and scientific pursuits.',
		costs: {
			science: 1200
		},
		researched: false,
		available: false,
		criteria: [6]
	},
	'11': {
		id: 11,
		name: 'Astronomy',
		description: 'Studying the stars isn\'t just for horoscopes; turtles can use the night sky for a variety of purposes.',
		costs: {
			science: 2000
		},
		researched: false,
		available: false,
		criteria: [6,9]
	},

})


