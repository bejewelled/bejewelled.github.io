
import {get, writable} from 'svelte/store'
import {builds, buildCounts, allGens, allBonuses} from './buildings.js'
import { science } from './science.js';
import {res, fameTab, unlockedResources, stardustTab } from './player.js'
import {stardustBasics} from './stardust.js'
import fm from '../calcs/formulas.js'
import tb from '../calcs/tables.js'



function jobManager(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		// number of jobs that are available to complete
		numJobs() {
			let num = 0
			for (let j of info) {
				if (!j['cooldown']) {
					num++;
				}
			}
			return num;
		},
		setSelf(obj) {
			update(i => {
				i = obj;
				return i;
			})
		},
		jobComplete: (index) => info[index]['cooldown'],
		addJob(index) {
			update(i => {
				let possibleTypes = [...get(unlockedResources)]
				let choiceSuccess = false;
				let type, difficulty;
				while (!choiceSuccess) {
					type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)]
					if (type != 'glory' && 
						type != 'fame' &&
						type != 'favor' &&
						type != 'stardust') choiceSuccess = true;
				}
				// effective difficulty
				// calculated based on amount and rarity of resource required
				let maxDiff = get(fameTab)['jobUpgrades'][1]['level'] + 2

				
				const diffTable = tb.jobDifficultyTable();
				// if rarity of the resource > 1, takes that into account
				// max rarity: 5
				const rarityMod = diffTable[type] || 1

	
				let timeBase = 90 + Math.floor(Math.random() * (210 + 200*Math.min(rarityMod, maxDiff)))
				const timeMod = Math.floor((timeBase - 200) / 200); // time mod can be up to 12
				difficulty = Math.floor(1.2*rarityMod + 0.5*timeMod);

				const time = timeBase * 3 + (Math.random()*2)

				const gtTemp = tb.difficultyGloryTable();
				const rewardMulti = (3 * Math.pow(1.1, get(fameTab)['jobUpgrades'][1]['level']));
				let reward = gtTemp[difficulty] * Math.max(1, rewardMulti * 2 * Math.pow(difficulty-1, 2) / 60.5);
				reward *= get(stardustBasics)[1]['formula'](get(stardustTab)['basicUpgrades'][1]);  // stardust bonus (Taurus)

				let amount = (get(allGens)[type] || 400 * Math.pow(1.03, Math.max(8 - difficulty, 1))) * time 
				i[index]['cooldown'] = false;
				i[index]['type'] = type;
				i[index]['amount'] = amount;
				i[index]['reward'] = reward;

				return i;
			})
		},
		// puts the job on [cd] second cooldown
		remJob(index) {
			update(i => {
				let cd = 600 * (Math.pow(0.95, get(fameTab)['jobUpgrades'][0]['level']))
				i[index]['initcd'] = cd*1000;
				i[index]['cooldown'] = true;
				i[index]['nextTime'] = Date.now() + cd*1000
				return i;
			})
		},
		renew() {
			update(i => {
				for (let c = 0; c < i.length; c++) {
					if (i[c]['cooldown'] && i[c]['nextTime'] < Date.now()) {
						i[c]['cooldown'] = false;
						this.addJob(c);
					}
				}
				return i;
			})
		},
		setSelf(obj) {
			update(i => {
				i = obj;
				return i;
			}) // iki
		}, // oi
	}
}


export const jobs = jobManager([
	{	
		index: 0,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	},
	{
		index: 1,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	},
	{
		index: 2,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	},
	{
		index: 3,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	},
	{
		index: 4,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	}
])

export const baseJobs = jobManager([
	{	
		index: 0,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	},
	{
		index: 1,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	},
	{
		index: 2,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	},
	{
		index: 3,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	},
	{
		index: 4,
		// whether this job slot is on cooldown
		cooldown: true,
		// the actual initial cooldown timer (used for styling)
		initcd: 0,
		// this will be a timestamp
		nextTime: 0,
		// glory gain
		reward: 1,
		// type of res needed
		type: "wood",
		// amount needed
		amount: 1000
	}
])