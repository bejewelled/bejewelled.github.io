
import {get, writable} from 'svelte/store'
import {builds, buildCounts, allGens, allBonuses} from './buildings.js'
import { science, baseScience } from './science.js';
import {res} from './player.js'
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
		addJob(index) {
			update(i => {
				let possibleTypes = Object.keys(get(res))
				let choiceSuccess = false;
				let type, difficulty;
				while (!choiceSuccess) {
					type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)]
					const diffTable = tb.jobDifficultyTable();
					if (diffTable[type]) {
						choiceSuccess = true;
						difficulty = Math.round(diffTable[type])
					}
				}
				// the amount of time (in seconds) worth of production required to complete
				// minimum of 90 seconds (1.5m), maximum of 3,600 seconds (1h)
				// times over 30m increase the difficulty
				const time = 90 + Math.floor(Math.random() * 3510)
				if (time > 300) difficulty++;
				if (time > 900) difficulty++;
				if (time > 1800) difficulty++;
				if (time > 2700) difficulty++;
				

				const gtTemp = tb.difficultyGloryTable();
				let reward = gtTemp[difficulty];
				let amount = (get(allGens)[type] || 400 * Math.pow(1.03, Math.max(8 - difficulty, 1))) * time 
				i[index]['cooldown'] = false;
				i[index]['type'] = type;
				i[index]['amount'] = amount;
				i[index]['reward'] = reward;

				return i;
			})
		},
		// puts the job on [cd] second cooldown
		remJob(index, cd = 3) {
			update(i => {
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
		}
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