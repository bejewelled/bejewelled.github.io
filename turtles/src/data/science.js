// @ts-nocheck
import {get, writable} from 'svelte/store'
import {builds, buildCounts, allGens, allBonuses} from './buildings.js'
import {res, visible, researched} from './player.js'
/**
 * @param {{ 0: { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; 
// the IDs of the science prerequisites to unlock this one (check README)
criteria: never[]; } | { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; 
// the IDs of the science prerequisites to unlock this one (check README)
criteria: never[]; }; 1: { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; }; 2: { id: number; name: string; description: string; costs: { science: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; }; 3: { id: number; name: string; description: string; costs: { science: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; }; 4: { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; }; 5: { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; }; 6: { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; }; 7: { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; }; 8: { id: number; name: string; description: string; costs: { science: number; fame: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; fame: number; }; researched: boolean; available: boolean; criteria: number[]; }; 9: { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; }; 10: { id: number; name: string; description: string; costs: { science: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; bonuses: { label: string; val: string; }[]; researched: boolean; available: boolean; criteria: number[]; }; 11: { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; } | { id: number; name: string; description: string; costs: { science: number; }; researched: boolean; available: boolean; criteria: number[]; }; }} info
 */
function scienceCreator(info) {
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
					visible.setRem(k[0], 'science')
				}
				visible.setAdd('infrastructure', 'science')
				return i;
			})
		},
		checkCriteria() {
			update(i => {
				for (let b of Object.entries(i)) {
					if (b[0] === 'infrastructure') {
						visible.setAdd(b[0], 'science');
						continue;
					}
					let isSatisfied = true;
					for (let req of b[1]['criteria']) {
						if (!(get(researched)['science'].has(req))) {
							console.log('ad')
							isSatisfied = false;

							break;
						}

					}
					if (isSatisfied === true) {
						visible.setAdd(b[0], 'science')
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
	'infrastructure': {			
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
	'language': {			
		id: 1,		
		name: 'Language',		
		description: 'How can your turtles do anything without language?',		
		costs: {		
			science: 75	
		},		
		researched: false,		
		available: false,		
		criteria: ['infrastructure']		
	},			
	'mining': {			
		id: 2,		
		name: 'Mining',		
		description: 'Metal is the gateway to advanced infrastructure. Allows sand nets to capture copper.',		
		costs: {		
			science: 120	
		},		
		researched: false,		
		available: false,		
		criteria: ['infrastructure']		
	},			
	'construction': {			
		id: 3,		
		name: 'Construction',		
		description: 'Enables more advanced structures; as a result, sand nets and studies are remodeled, increasing their effectiveness.',		
		costs: {		
			science: 200	
		},		
		researched: false,		
		available: false,		
		criteria: ['language']		
	},			
	'writing': {			
		id: 4,		
		name: 'Writing',		
		description: 'Without a codified writing system, progress will slow to a halt. Writing not only increases internal productivity, but allows contact with others who may want to experience turtle civilization.',		
		costs: {		
			science: 250	
		},		
		researched: false,		
		available: false,		
		criteria: ['language']		
	},			
	'taming': {			
		id: 5,		
		name: 'Taming',		
		description: 'Your turtles have learned a way to domesticate their prey instead of eating it.',		
		costs: {		
			science: 350	
		},		
		researched: false,		
		available: false,		
		criteria: ['mining']		
	},			
	'recordkeeping': {			
		id: 6,		
		name: 'Recordkeeping',		
		description: 'Recordkeeping opens a wide door to turtle civilization, including specialized labor.',		
		costs: {		
			science: 500	
		},		
		researched: false,		
		available: false,		
		criteria: ['writing']		
	},			
	'heat': {			
		id: 7,		
		name: 'Heat',		
		description: 'Wielding heat in harsh underwater conditions is crucial for wielding newly discovered metals.',		
		costs: {		
			science: 500	
		},		
		researched: false,		
		available: false,		
		criteria: ['construction']		
	},			
	'wizardry': {			
		id: 8,		
		name: 'Wizardry',		
		description: '...',		
		costs: {		
			science: 10000,	
			fame: 100	
		},		
		researched: false,		
		available: false,		
		criteria: ['writing', 'heat']		
	},			
	'agriculture': {			
		id: 9,		
		name: 'Agriculture',		
		description: 'Agriculture allows for large-scale and organized farming.',		
		costs: {		
			science: 800	
		},		
		researched: false,		
		available: false,		
		criteria: ['recordkeeping']		
	},			
	'basic mathematics': {			
		id: 10,		
		name: 'Basic Mathematics',		
		description: 'Numeric competency is required for advanced architectural and scientific pursuits. Turtles can use this to dramatically improve their sand nets.',		
		costs: {		
			science: 800	
		},		
		researched: false,		
		available: false,		
		criteria: ['recordkeeping']		
	},			
	'astronomy': {			
		id: 11,		
		name: 'Astronomy',		
		description: 'Studying the stars isn\'t just for horoscopes; turtles can use the night sky for a variety of purposes.',		
		costs: {		
			science: 1200	
		},		
		researched: false,		
		available: false,		
		criteria: ['recordkeeping', 'agriculture']		
	},			
	'government': {			
		id: 12,		
		name: 'Government',		
		description: 'A formal, centralized power opens up endless pathways to future improvements. Unlocks many new upgrades.',		
		costs: {		
			science: 2500	
		},		
		researched: false,		
		available: false,		
		criteria: ['recordkeeping']		
	},			
	'crafting': {			
		id: 13,		
		name: 'Crafting',		
		description: 'More sophisticated materials can be made, enabling new structures.',		
		costs: {		
			science: 3500,	
			iron: 1500,	
			coal: 1000	
		},		
		researched: false,		
		available: false,		
		criteria: ['basic mathematics']		
	},			
				
})				


				
export const baseScience = scienceCreator({				
		'infrastructure': {			
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
	'language': {			
		id: 1,		
		name: 'Language',		
		description: 'How can your turtles do anything without language?',		
		costs: {		
			science: 75	
		},		
		researched: false,		
		available: false,		
		criteria: ['infrastructure']		
	},			
	'mining': {			
		id: 2,		
		name: 'Mining',		
		description: 'Metal is the gateway to advanced infrastructure. Allows sand nets to capture copper.',		
		costs: {		
			science: 120	
		},		
		researched: false,		
		available: false,		
		criteria: ['infrastructure']		
	},			
	'construction': {			
		id: 3,		
		name: 'Construction',		
		description: 'Enables more advanced structures; as a result, sand nets and studies are remodeled, increasing their effectiveness.',		
		costs: {		
			science: 200	
		},		
		researched: false,		
		available: false,		
		criteria: ['language']		
	},			
	'writing': {			
		id: 4,		
		name: 'Writing',		
		description: 'Without a codified writing system, progress will slow to a halt. Writing not only increases internal productivity, but allows contact with others who may want to experience turtle civilization.',		
		costs: {		
			science: 250	
		},		
		researched: false,		
		available: false,		
		criteria: ['language']		
	},			
	'taming': {			
		id: 5,		
		name: 'Taming',		
		description: 'Your turtles have learned a way to domesticate their prey instead of eating it.',		
		costs: {		
			science: 350	
		},		
		researched: false,		
		available: false,		
		criteria: ['mining']		
	},			
	'recordkeeping': {			
		id: 6,		
		name: 'Recordkeeping',		
		description: 'Recordkeeping opens a wide door to turtle civilization, including specialized labor.',		
		costs: {		
			science: 500	
		},		
		researched: false,		
		available: false,		
		criteria: ['writing']		
	},			
	'heat': {			
		id: 7,		
		name: 'Heat',		
		description: 'Wielding heat in harsh underwater conditions is crucial for wielding newly discovered metals.',		
		costs: {		
			science: 500	
		},		
		researched: false,		
		available: false,		
		criteria: ['construction']		
	},			
	'wizardry': {			
		id: 8,		
		name: 'Wizardry',		
		description: '...',		
		costs: {		
			science: 10000,	
			fame: 100	
		},		
		researched: false,		
		available: false,		
		criteria: ['writing', 'heat']		
	},			
	'agriculture': {			
		id: 9,		
		name: 'Agriculture',		
		description: 'Agriculture allows for large-scale and organized farming.',		
		costs: {		
			science: 800	
		},		
		researched: false,		
		available: false,		
		criteria: ['recordkeeping']		
	},			
	'basic mathematics': {			
		id: 10,		
		name: 'Basic Mathematics',		
		description: 'Numeric competency is required for advanced architectural and scientific pursuits. Turtles can use this to dramatically improve their sand nets.',		
		costs: {		
			science: 800	
		},		
		researched: false,		
		available: false,		
		criteria: ['recordkeeping']		
	},			
	'astronomy': {			
		id: 11,		
		name: 'Astronomy',		
		description: 'Studying the stars isn\'t just for horoscopes; turtles can use the night sky for a variety of purposes.',		
		costs: {		
			science: 1200	
		},		
		researched: false,		
		available: false,		
		criteria: ['recordkeeping', 'agriculture']		
	},			
	'government': {			
		id: 12,		
		name: 'Government',		
		description: 'A formal, centralized power opens up endless pathways to future improvements. Unlocks many new upgrades.',		
		costs: {		
			science: 2500	
		},		
		researched: false,		
		available: false,		
		criteria: ['recordkeeping']		
	},			
	'crafting': {			
		id: 13,		
		name: 'Crafting',		
		description: 'More sophisticated materials can be made, enabling new structures.',		
		costs: {		
			science: 3500,	
			iron: 1500,	
			coal: 1000	
		},		
		researched: false,		
		available: false,		
		criteria: ['basic mathematics']		
	},	
				
})				



