<div class='container'>
	<div class='grid mainText row header-bar h-[3px] p-1'>
		<div class='grid grid-cols-[16_/_span_16] items-start pb-2'>
			<div class='col-span-3'>
					<div class='flex flex-row'>
						<div class='flex'>
							<SaveLoadButton on:click={() => save()} text='Save'/>
						</div>
						<div class='flex'>
							<SaveLoadButton on:click={() => reset()} text='Reset'/>
						</div>
					</div>
			</div>
			<div class='col-span-5'>

			</div>
		</div>
	</div>
		<div class="grid row items-start grid-cols-12 p-2 mt-3">

				<!-- Resource Displays -->
			<div class='p-1 col-span-4'>
				<div class='grid grid-rows-12 items-start'>
					<div class='grid grid-cols-12 items-start'>


				{#each currRes as res}
					{#if $unlockedResources.has(res[0])}

							<div class="col-span-4 mainText">
							<span class="{colors[res[0]] || colors['default']}">{res[0]}
							</span></div>	
							<div class='col-span-5 text-left mainText'>
								<span
								class='{res[1][0] > res[1][1]*0.9997 && res[1][1] >= 0 ? "text-rose-400" : 
								res[1][0] > res[1][1]*0.85 && res[1][1] >= 0 ? "text-orange-400" : "text-white"}'>{round(res[1][0], 3)}
								</span>
								{#if res[1][1] > -0.9}
								<span class='gameTextWhite'> / {round(res[1][1], 3)}</span>
								{/if}
							</div>
						
						<div class='col-span-3 text-left mainText gameTextWhite 
						has-tooltip mainText select-none'>
						{#if !($allGens[res[0]] === undefined) && $allGens[res[0]] > 0}
							{#if $resDeltas[res[0]] >= 0}+{/if}
							{#if Math.abs($resDeltas[res[0]]) >= 0.0000199}
								{round($resDeltas[res[0]]*5)} / sec
							{:else}
								... / sec
							{/if}
						{/if}


					<!-- production tooltip -->
					<span class='w-[max-width-270px] text-small
					grid row tooltip shadow-lg p-1 border-white border bg-[#222529] ml-16'>
							<div class='grid row grid-cols-12 items-start pb-1'>
										<span class='col-span-7 text-left'>
											Production: 
										</span>
										<span class='col-span-5 text-right pr-1'>
											{#if $allGens[res[0]] > -0.0003}+{:else}-{/if}
											{round($allGens[res[0]]*5, 3)} / sec
										</span>
									</div>
									<!-- add bonuses to tooltip, if applicable -->
									{#if $allBonuses[res[0]] > 0.0003}
							<div class='grid row grid-cols-12 items-start pb-1'>
										<span class='col-span-7 text-left'>
											Bonuses: 
										</span>
										<span class='col-span-5 text-right pr-1'>
											{#if $allBonuses[res[0]] > -0.0003}+{:else}{/if}
											{round($allBonuses[res[0]], 3)}%
										</span>
									</div>
									{/if}
									{#if gloryProdBonus > 0}
										<div class='grid row grid-cols-12 items-start pb-1'>
											<span class='col-span-7 text-left'>
												Glory (Production): 
											</span>
											<span class='col-span-5 text-right pr-1'>
												+{round(gloryProdBonus * 100)}%
											</span>
										</div>	
										<div class='grid row grid-cols-12 items-start pb-1'>
											<span class='col-span-7 text-left'>
												Glory (Conversion): 
											</span>
											<span class='col-span-5 text-right pr-1'>
												+{round(gloryProdBonus* 0.05 * 100)}%
											</span>
										</div>									
									{/if}
									<!-- add subtractions to tooltip, if applicable -->
									{#if $allSubtracts[res[0]] > 0.0003}
							<div class='grid row grid-cols-12 items-start pb-1'>
										<span class='col-span-7 text-left'>
											Consumption: 
										</span>
										<span class='col-span-5 text-right pr-1'>
											{#if $allSubtracts[res[0]] > -0.0003}-{:else}{/if}
											{round($allSubtracts[res[0]]*5, 3)} / sec
										</span>
									</div>
									{/if}
									{#if res[1][1] > 0}
										<hr/>
										{#if $resDeltas[res[0]] >= 0}
										<div class='grid row grid-cols-12 pt-1 text-left'>							
											<span class='col-span-7'>Time until cap: &nbsp; </span>
											<span 
											class='col-span-5 pr-1 text-right {timeToCap(res) <= 0.0003 ? "text-rose-400" : 
											timeToCap(res) <= 120 ? "text-orange-400" : "text-white"}'>
											{fm.formatToTime(Math.round((res[1][1] - res[1][0]) / (5*$resDeltas[res[0]])))}
											</span>
										</div>
										{:else}
										<div class='grid row grid-cols-12 pt-1 text-left'>							
											<span class='col-span-7'>Time until zero: &nbsp; </span>
											<span 
											class='col-span-5 text-right {timeToCap(res) <= 0.0003 ? "text-rose-400" : 
											timeToCap(res) <= 120 ? "text-orange-400" : "text-white"}'>
											{fm.formatToTime(Math.round(Math.abs((res[1][0]) / (5*$resDeltas[res[0]]))))}
											</span>
										</div>
										{/if}
									{/if}
								</span>
						</div>
							{/if}	
				{/each}

<!-- 				{#each $craftRes as re}
					{#if res[0][2]}
							<div class="col-span-4 mainText">
							<span class="{colors[res[0]] || colors['default']}">{re[0]}
							</span></div>	
							<div class='col-span-5 text-left mainText'>
								<span class='text-white'> {round(re[1][0], 3)} </span>
								{#if re[1][1] > -0.9}
								<span class='gameTextWhite'> / {round(re[1][1], 3)}</span>
								{/if}
							</div>
					{/if}
				{/each} -->

					</div>
				</div>
			</div>

				<!-- Game Tab Buttons go here -->
			<div class='p-4 col-span-5 items-start mb-12'>
				<div class='wrapper mt-2'>
					<div class='flex flex-row'>
							<div class='flex'>
								<TabButton on:click={() => changeTab('main')} text='Buildings'/>
							</div>
						{#if $totalRes['science'][0] > 0.01}
							<div class='flex'>
								<TabButton on:click={() => changeTab('science')} text='Science'/>
							</div>
						{/if}
						{#if $res['fame'][0] > 0.01}
							<div class='flex'>
								<TabButton on:click={() => changeTab('fame')} text='Fame'/>
							</div>
						{/if}
						{#if $totalRes['glory'] > 10}
							<div class='flex'>
								<TabButton on:click={() => changeTab('policy')} text='Policy'/>
							</div>
						{/if}
						{#if $fameTab['gloryLevel'] >= 3}
							{#if $fameTab['gloryLevel'] >= 3}
							<div class='flex'>
								<TabButton on:click={() => changeTab('policy')} text='Policy'/>
							</div>
							{:else}
							<div class='flex'>
								<TabButton text='Lv 7'/>
							</div>
							{/if}
						{/if}
						{#if $fameTab['gloryLevel'] >= 3}
							{#if $fameTab['gloryLevel'] >= 10}
							<div class='flex'>
								<TabButton on:click={() => changeTab('policy')} text='Policy'/>
							</div>
							{:else}
							<div class='flex'>
								<TabButton text='Lv 10'/>
							</div>
							{/if}
						{/if}
						{#if $fameTab['gloryLevel'] >= 3}
							{#if $fameTab['gloryLevel'] >= 13}
							<div class='flex'>
								<TabButton text='Policy'/>
							</div>
							{:else}
							<div class='flex'>
								<TabButton text='Lv 13'/>
							</div>
							{/if}
						{/if}
					</div>
				</div>

				<!-- Game Tab Content goes here -->
				{#if activeTab == 'main'}
					<div class='grid row'>
						<div class='p-1 grid grid-cols-2 items-center'>
							<div class='p-1'>
								<ClickButton text={'Gather Kelp'} on:click={kelpClick}></ClickButton>
							</div>
							<!-- change the length each time you add a building !-->
							{#each Object.entries($builds) as build}
							{#if build[1]['available'] && build[1]['visible']}
							<div class='p-1'>
								<BuildingButton id={build[1]['name']}
								text={build[1]['toggleable'] ? 
								build[1]['name'] + " (" + $buildCounts[build[1]['name']][1] + " / " + $buildCounts[build[1]['name']][0] + ")" :
								build[1]['name'] + " (" + $buildCounts[build[1]['name']][0] + ")"}/>
							</div>
							{/if}
							{/each}

							<div class='p-1'>

							</div>
						</div>
					</div>
				{/if}

				{#if activeTab == 'science'}
					<label>
						<input type=checkbox bind:checked={showUnlockedSciences}>
						<span class='gameTextWhite select-none'>Show already researched technologies</span>
					</label>
					{#each {length: numScience} as _, i}
						{#if (!($science[i]['researched']) || showUnlockedSciences) && $science[i]['available']}
						<div class='p-1'> 
							<ScienceButton id={i} class='p-1' 
							text={$science[i]['name']}/>
						</div>
						{/if}
					{/each}
				{/if}

				{#if activeTab == 'policy'}
				<div class='p-3'></div>
				<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
  				<div class="mainText progbar-fame bg-green-300 h-2.5 rounded-full" style="width: {($policyTab['policiesResearched'] - ($policyTab['policyLevel']*10) / 10)}% "></div>
					</div>
				<div class='text-center gameTextWhite pt-1 mainText'>Unlock {((($policyTab['policyLevel']+1) * 10) - ($policyTab['policiesResearched']))} more policies to gain milestone bonuses. </div>

				<div class='text-center gameTextWhite pt-1 mainText'>Current bonus to all policies: <strong>{round(fm.calcPolicyBonus($policyTab['policyLevel']))}%</strong></div>
				<div class='p-3'><hr/></div>
				<label>
					<input type=checkbox bind:checked={showUnlockedPolicy}>
					<span class='gameTextWhite select-none'>Show already researched policies</span>
				</label>
					{#each Object.entries($policy) as pol}
						{#if (!(pol[1]['researched']) || showUnlockedPolicy) && pol[1]['available']}
					<div class='p-1 grid'>
						<div class='row'>
							<PolicyButton id={pol[1]['name']} class='p-1'/>
						</div> 
					</div> 
					{/if}
					{/each}
				{/if}

				{#if activeTab == 'fame'}
					<div class='p-2'>
					</div>
					<div class='p-2 grid'>
						<div class='row'>
							<FameBankButton class='p-1'/>
						</div> 
					</div>
					<br/>
					<div>
						<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
  						<div class="mainText progbar-fame bg-orange-400 h-2.5 rounded-full" style="width: {$res.glory[0] / gloryNextLevelTarget * 100}% "></div>
						</div>
					</div> 
					<div class='text-center gameTextWhite pt-1 mainText'>You are glory level <strong>{$fameTab['gloryLevel']}</strong></div>
					<div class='text-center gameTextWhite'>You need {round(gloryNextLevelTarget - $res.glory[0]
					)} glory to reach the next level.</div>
					<div class='p-1 text-center mainText gameTextWhite'>Your glory level grants +{round(fm.calcGloryBonusProduction($fameTab['gloryLevel']) * 100)}% to all production.</div>
					<div class='p-3'> <hr/> </div>
					<!--  Use a for loop when the quest backend is finished  -->
					{#each $jobs as job}
					<div class='grid grid-cols-12'>
						<div class='col-span-3 pr-1'> <QuestSubmitButton index={job['index']} /> </div>
					{#if !job['cooldown']}
						<div class='col-span-1 pr-1'> <QuestRefreshButton index={job['index']} /> </div>
						<div class='col-span-4 p-1 text-vert-center text-right gameTextWhite mainText'>  {round(job['amount'])} {job['type']}</div>
						<div class='col-span-4 p-1 text-vert-center text-right text-amber-300 mainText'>+{round(job['reward'])} Glory</div>
					
					{:else}
					<div class='col-span-9 p-1 text-vert-center text-right text-gray-600 mainText'>This job is refreshing.</div>
					{/if}
					<div class='p-1'></div>
					</div>
					{/each}

					<div class='p-3'> <hr/> </div>
					{#each $fameTab['jobUpgrades'] as job}
					<div class='row col-span-3 pt-1 pb-1'> <QuestUpgradeButton index={job['index']}/> </div>
					{/each}
				{/if}
			</div>
		</div>
</div>


<script>
// @ts-nocheck

	import BuildingButton from '../components/buttons/BuildingButton.svelte';
	import ScienceButton from '../components/buttons/ScienceButton.svelte';
	import ClickButton from '../components/buttons/ClickButton.svelte';
	import SaveLoadButton from '../components/buttons/SaveLoadButton.svelte';
	import TabButton from '../components/buttons/TabButton.svelte';
	import PolicyButton from '../components/buttons/PolicyButton.svelte'
	import FameBankButton from '../components/buttons/FameBankButton.svelte';
	import QuestSubmitButton from '../components/buttons/QuestSubmitButton.svelte';
	import QuestRefreshButton from '../components/buttons/QuestRefreshButton.svelte';
	import QuestUpgradeButton from '../components/buttons/QuestUpgradeButton.svelte';
	import { res, baseRes, gloryBonuses, totalRes, craftRes, baseCraftRes, fameTab, baseFameTab, policyTab, basePolicyTab, unlockedResources } from '../data/player.js';
	import { builds, allGens, allSubtracts, allBonuses, resDeltas, buildCounts, baseBuilds, baseAllGens, baseBuildCounts } from '../data/buildings.js';
	import { science, baseScience } from '../data/science.js';
	import {jobs, baseJobs} from '../data/jobs.js'
	import { policy, basePolicy } from '../data/policy';
	import {onMount, onDestroy} from 'svelte';
	import {get} from 'svelte/store'
	import fm from '../calcs/formulas.js'

	// REACTIVE_VARS
	$: numBuildings = Object.entries(get(builds)).length;
	$: numScience = Object.entries(get(science)).length;
	$: numPolicy = Object.entries(get(policy)).length;
	let saveInterval;
	let checkResUnlockInterval;
	$: currRes = Object.entries(get(res));
	$: gloryBuffs = Object.entries(get(gloryBonuses));

	let gloryVal = get(res)['glory'][0]
	let gloryProdBonus = fm.calcGloryBonusProduction($fameTab['gloryLevel']);

	// sets display color for the resource name
	// good as a reference for other sections
	// RES_COLORS
	let colors = {
		default: 'text-white',
		kelp: 'text-white',
		sand: 'text-white',
		wood: 'text-white',
		iron: 'text-white',
		coal: 'text-white',
		fame: 'text-orange-400',
		glory: 'text-amber-300',
		science: 'text-sky-500',
		magic: 'text-indigo-500'
	}

	// NONREACTIVE_VARS
	let activeTab = 'main';
	let showUnlockedSciences = false;
	let showUnlockedPolicy;
	let getLength = ((obj) => {
		return Object.keys(obj).length;
	});
	let timeToCap = ((res) => {
		return Math.round((res[1][1] - res[1][0]) / (5*get(allGens)[res[0]]))
	});

	// glory amount required for the next level
	let findGloryNextTarget = (lv) => (Math.floor(Math.pow(1.1, lv) 
		* 10 * Math.pow(lv,4) * 0.01) / 0.01)

	let gloryNextLevelTarget = findGloryNextTarget(get(fameTab)['gloryLevel']) 
	console.log(gloryNextLevelTarget)

	// number rounder. Use 3 decimals as default
	// add more when needed (like thousands, etc)
	// let round  = ((i, places) => {
	// 	let s = ''; // shortener
	// 	if (i > 9750) {
	// 		i /= 1000;
	// 		s = 'K';
	// 	}
	// 	if (i < 9750) {
	// 		return (Math.floor(i*Math.pow(10,places))/Math.pow(10,places)).toLocaleString();		
	// 	}
	//  	return (Math.floor(i*Math.pow(10,places))/Math.pow(10,places)).toString() + s;
	// })

  const round = (n, places = 3) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
  };




	// onMount
	let lastTick = performance.now()
	onMount(() => {
		$unlockedResources = new Set();
		console.log($unlockedResources)

		// init build count list
		buildCounts.init(100);

		// fix base buildings/science loadouts if there is a discrepancy
		//baseBuilds.setSelf(get(builds));
		//baseScience.setSelf(get(science));
		// if there is save data, load it
		if (localStorage.getItem('data') !== null) {
			load();
			// adds new content, if needed
			fixContent();
			allGens.updateAll();
			allSubtracts.updateAll();
			allBonuses.updateAll();
			resDeltas.updateAll();
		}

		gloryNextLevelTarget = findGloryNextTarget(get(fameTab)['gloryLevel']);
		gloryProdBonus = fm.calcGloryBonusProduction($fameTab['gloryLevel']);
		// start main game loop
		let rid = requestAnimationFrame(function update() {
			let now = performance.now()
		  	const delta = now - lastTick
		  	lastTick = now
		});

		// main game loop
		// NOTE: only add things to this loop that MUST be updated each tick
		setInterval(function gameLoop() {
			rid = requestAnimationFrame(function update() {
				let now = performance.now()
			  	const delta = now - lastTick
			  	lastTick = now
			  	currRes = Object.entries(get(res));
			  	addRes(100*delta/200);
			});
		}, 200);

		// save every 30s (this time doesn't have to be accurate so don't need to use dt)
		saveInterval = setInterval(function savegame() {
			save();
		}, 30000);

		// secondary loop
		// put most functional, non-visual items here (checking unlocks, levelups, quests etc.)
		// check for new unlocks every second
		checkResUnlockInterval = setInterval(() => { 
			builds.checkSciCriteria();
			// level up if player has enough glory for the next level
			if (get(res)['glory'][0] >= gloryNextLevelTarget) {
				fameTab.add('gloryLevel', 1);
				res.sub('glory', gloryNextLevelTarget)
				gloryNextLevelTarget = findGloryNextTarget(get(fameTab)['gloryLevel'] + 1)
				gloryProdBonus = fm.calcGloryBonusProduction($fameTab['gloryLevel'])
			}
			for (let c of Object.entries(get(builds))) {
      		builds.checkResUnlockThreshold(c[0]);
    	}

    	jobs.renew();
    	// CONSOLE_TEST


    }, 1000)

		// unlock buildings that need to be unlocked
		builds.checkSciCriteria();
	});

	function fixContent() {
		let existingBuilds = get(builds);
		for (let [id, baseVal] of Object.entries(get(baseBuilds))) {
				for (let key of 
				['name', 'description', 'costs', 'ratio', 'gens', 'bonuses', 'caps', 'toggleable', 'criteria']) {
						if (existingBuilds[id][key] != baseVal[key]) {
							builds.setItemVal(id, key, baseVal[key])
						}
				}
				if (existingBuilds[id] === undefined) {
					builds.addNew(id, baseVal)
				}
		}
		let existingSci = get(science);
		science.setSelf(get(baseScience));
		//console.log(existingSci);
		// baseScience.getSelf();
		// const newSci = get(baseScience);
		// //console.log(newSci);
		for (let [id, baseVal] of Object.entries(get(baseScience))) {
				if (existingSci[id] === undefined) {
					science.addNew(id, baseVal)
				} else {
					for (let key of 
				['id', 'name', 'description', 'costs', 'bonuses', 'criteria']) {
						if (existingSci[id][key] != baseVal[key]) {
							science.setItemVal(id, key, baseVal[key])
						}
				}
				}
		}
		for (let [id, obj] of Object.entries(get(science))) {
				if (!(existingSci[id] === undefined) && existingSci[id]['researched'] == true) {
					science.unlock(id);
				}
		}
		let existingPolicy = get(policy);
		policy.setSelf(get(basePolicy));
		//console.log(existingSci);
		// baseScience.getSelf();
		// const newSci = get(baseScience);
		// //console.log(newSci);
		for (let [id, baseVal] of Object.entries(get(basePolicy))) {
				if (existingPolicy[id] === undefined) {
					science.addNew(id, baseVal)
				} else {
					for (let key of 
				['id', 'name', 'description', 'costs', 'bonuses', 'criteria']) {
						if (existingPolicy[id][key] != baseVal[key]) {
							policy.setItemVal(id, key, baseVal[key])
						}
				}
				}
		}
		for (let [id, obj] of Object.entries(get(policy))) {
				if (!(existingPolicy[id] === undefined) && existingPolicy[id]['researched'] == true) {
					policy.unlock(id);
				}
		}
		builds.checkSciCriteria();
		allGens.updateAll();
		allSubtracts.updateAll();
		allBonuses.updateAll();
		resDeltas.updateAll();
		science.checkCriteria();
		policy.checkCriteria();
	}

//--------------

	function changeTab(tab) {
		activeTab = tab;
	}

	let counter = 0;
	function addRes(delta) {
		res.addMany(get(resDeltas), delta);
		totalRes.addMany(get(resDeltas), delta, false, true);
		counter++;
		if (counter > 5) {
			counter = 0;
			allGens.updateAll();
			// adds any resources that are currently being produced
			for (let i of Object.keys(get(allGens))) {
				if (get(allGens)[i] > 0) {
					$unlockedResources.add(i);
				}
			}
			if (get(totalRes)['glory'][0] > 0) {
				$unlockedResources.add('glory')
			}
			allSubtracts.updateAll();
			allBonuses.updateAll();
			resDeltas.updateAll();
		}
  }


	function kelpClick() {
		res.add('kelp', 1);
		totalRes.add('kelp', 1);
	}

	function save() {
		const savedata= [get(res), get(builds), get(buildCounts), get(allGens)];
		// const saveres = get(res);
		// const savebuilds = get(builds);
		// const savebuildcounts = get(buildCounts);
		// const savegens = get(allGens);
		let savestr = {}
		savestr['res'] = get(res);
		savestr['totalRes'] = get(res);
		savestr['builds'] = get(builds);
		savestr['buildCounts'] = get(buildCounts);
		savestr['allGens'] = get(allGens);
		savestr['allSubtracts'] = get(allSubtracts);
		savestr['resDeltas'] = get(resDeltas)
		savestr['science'] = get(science);
		savestr['policy'] = get(policy);
		savestr['fameTab'] = get(fameTab);
		savestr['unlockedResources'] = [...$unlockedResources]; // convert set to array to store
		savestr['jobs'] = get(jobs)
		savestr = btoa(JSON.stringify(savestr));
		localStorage.setItem('data', savestr);
	}

	function load() {
		const savestr = JSON.parse(atob(localStorage.getItem('data')));
		// const savedata = savestr.split("} ")
		res.setSelf(savestr['res'] || get(baseRes));
		totalRes.setSelf(savestr['totalRes'] || get(totalRes));
		builds.setSelf(savestr['builds'] || get(baseBuilds));
		science.setSelf(savestr['science'] || get(baseScience));
		buildCounts.setSelf(savestr['buildCounts'] || get(baseBuildCounts));
		policy.setSelf(savestr['policy'] || get(basePolicy));
		fameTab.setSelf(savestr['fameTab'] || get(baseFameTab));
		jobs.setSelf(savestr['jobs'] || get(baseJobs));
		$unlockedResources = new Set(Object.values(savestr['unlockedResources']));	
		allGens.updateAll();
		allSubtracts.updateAll();
		allBonuses.updateAll();
		resDeltas.updateAll();
		builds.checkSciCriteria();
		science.checkCriteria();
		policy.checkCriteria();
	}

	// this will apply all science bonuses from any researched sciences
	function applyAllScience() {
		for (let i of Object.entries(get(science))) {
			if (i[1]['researched']) {
				science.updateSpecialCase(i[0]);
			}
		}
	}

	function reset() {
	 	let confLeft = 5;
	 	if (!confirm("ARE YOU SURE you want to reset? This is a HARD reset and will clear everything! (Additional confirmation required after this)")) {
	 		return;
	 	}
	 	let confText = prompt("Please type \"I want to reset the game.\" EXACTLY as shown (without quotes) to reset.");
	 	if (confText !== "I want to reset the game.") {
	 		return;
	 	}
		baseRes.clear();
		console.log(get(baseRes));
		res.setSelf(get(baseRes));
		//automatic fame banking
		let bankAmt = get(res)['fame'][0]
    res.set('fame', 0);
    res.add('glory', bankAmt);

    fameTab.setSelf(get(baseFameTab));
		builds.setSelf(get(baseBuilds));
		buildCounts.init(100);
		science.setSelf(get(baseScience));
		science.lockAll();
		science.checkCriteria();
		$unlockedResources = new Set(['kelp']);
		activeTab = 'main';
		allGens.updateAll();
		allSubtracts.updateAll();	
		allBonuses.updateAll();
		resDeltas.updateAll();
		builds.hideAll();
		save();
	 }
</script>


<style>
	:global(body) {
		background-color: #222529;
	}
	:global(.mainText) {
		font-size: 17px;
	}
	:global(.game-text-size) {
		font-size: 17px;
	}
	:global(.gameText) {
		font-size: 17px;
	}
	:global(.gameTextWhite) {
		font-size: 17px;
		color: white;
	}
	:global(.text-small-white) {
		font-size: 14px;
		color: white;
	}
	:global(.text-small) {
		font-size: 14px;
	}
	:global(.text-small-gray) {
    font-size: 14px;
    color: gray;
  }
  :global(.text-med-gray) {
    font-size: 14px;
    color: gray;
  }
  :global(.text-small-gray) {
    font-size: 13px;
    color: gray;
  }
 :global(.game-btn-noafford) {
    border: 1px solid #696969;
    color: #696969;
    cursor: pointer;
  }
  :global(.game-btn) {
    border: 1px solid #c9c9c9;
    color: #c9c9c9;
    cursor: pointer;
  }
  :global(.game-btn-border) {
  	border: 1px solid white;
    cursor: pointer;
  }
  :global(.game-btn-border-noafford) {
  	border: 1px solid #c9c9c9;
    cursor: pointer;
  }

  :global(.game-btn:hover) {
    color: white;
    border: 1px solid white;
  }
  :global(.game-btn-toggleon) {
    border: 1px solid #50cc71;
    color: #50cc71;
    cursor: pointer;
  }
  :global(.game-btn-toggleon:hover) {
    border: 1px solid #78f599;
    color: #78f599;
    cursor: pointer;
  }
  :global(.game-btn-toggleoff) {
    border: 1px solid #a14861;
    color: #a14861;
    cursor: pointer;
  }
  :global(.game-btn-toggleoff:hover) {
    border: 1px solid #ed799a;
    color: #ed799a;
    cursor: pointer;
  }
	:global(.game-btn-nostorage) {
    border: 1px solid #853834;
    color: #853834;
    cursor: pointer;
  }
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }

</style>