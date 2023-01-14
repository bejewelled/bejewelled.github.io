
import {get, writable} from 'svelte/store'
import {builds, buildCounts, allGens, allBonuses} from './buildings.js'
import { science, baseScience } from './science.js';
import {res, fameTab, unlockedResources } from './player.js'
import fm from '../calcs/formulas.js'
import tb from '../calcs/tables.js'



function jobManager(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		// number of jobs that are available to complete
		numJobs() {
			const num = 0
			for (let j of info) {
				if (!j['cooldown']) {
					num++;
				}
			}
			return num;
		},
		jobComplete: (index) => info[index]['cooldown'],
		// 8.68k - ignore
		addJob(index) {
			update(i => {
				let possibleTypes = [...get(unlockedResources)]
				let choiceSuccess = false;
				let type, difficulty;
				while (!choiceSuccess) {
					type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)]
					if (type != 'glory' && type != 'fame') choiceSuccess = true;
				}
				// effective difficulty
				// calculated based on amount and rarity of resource required
				let maxDiff = get(fameTab)['jobUpgrades'][1]['level'] + 4

				
				const diffTable = tb.jobDifficultyTable();
				// if rarity of the resource > 1, takes that into account
				// up to 64x (4^3) multiplier
				const rarityMod = diffTable[type] || 1

	
				let time = 90 + Math.floor(Math.random() * (210 + 200*Math.min(rarityMod, maxDiff)))
				const timeMod = Math.floor((time - 200) / 200);
				difficulty = Math.floor(2*rarityMod + 0.8*effDiff);

				const gtTemp = tb.difficultyGloryTable();
				const rewardMulti = (3 * Math.pow(1.1, get(fameTab)['jobUpgrades'][1]['level']));
				let reward = gtTemp[difficulty] * (rewardMulti * 2 * Math.pow(difficulty-1, 2) / 60.5);
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
				for (let c = 0; c < 5; c++) {
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
			})
		},
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