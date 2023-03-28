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

							<!-- Divider between basic/special resources -->
							{#if res[0] === 'science'}
								<div class='lg:col-span-12 py-3'></div>							
							{/if}

							
							<div class="lg:col-span-3 mainText">
							<span class="{colors[res[0]] || colors['default']}">{res[0]}
							</span></div>	
							<div class='lg:col-span-5 text-left mainText'>
								<span
								class='{res[1][0] > res[1][1]*0.9997 && res[1][1] >= 0 ? "text-rose-400" : 
								res[1][0] > res[1][1]*0.85 && res[1][1] >= 0 ? "text-orange-400" : "text-white"}'>{round(res[1][0], 3)}
								</span>
								{#if res[1][1] > -0.9}
								<span class='gameTextWhite'> / {round(res[1][1], 3)}</span>
								{/if}
							</div>
						
						<div class='col-span-4 invisible lg:visible text-left mainText gameTextWhite 
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
									{#if (gloryProdBonus-1) > 0}
										<div class='grid row grid-cols-12 items-start pb-1'>
											<span class='col-span-7 text-left'>
												Glory Level: 
											</span>
											<span class='col-span-5 text-right pr-1'>
												+{round((gloryProdBonus-1) * 100)}%
											</span>
										</div>										
									{/if}
									{#if $stardustTab['basicUpgrades'][0] > 0}
										<div class='grid row grid-cols-12 items-start pb-1'>
											<span class='col-span-7 text-left'>
												Stardust (Aries):  
											</span>
											<span class='col-span-5 text-right pr-1'>
												+{round(($stardustBasics[0]['formula']($stardustTab['basicUpgrades'][0])-1) * 100)}%
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

				<!-- Crafted Resource Display  -->
				<div class='col-span-12 pt-5 pb-5 gameTextWhite'></div>
				{#each Object.entries($craftRes) as cres}
					{#if $craftTier >= cres[1][3]}
							<div class="col-span-3 mainText py-0 text-left">
								<span class="{colors[cres[0]] || colors['default']}">{cres[0]}</span>
							</div>
							<div class="col-span-3 mainText py-0 gameTextWhite text-left">
								<span class='text-white'>{round($craftRes[cres[0]][0])}</span>
							</div>
							<div class="col-span-2 pr-1 py-0 mainText">
								<CraftButton id={cres[0]} amt=1 />
							</div>
							<div class="col-span-2 pr-1 py-0 mainText">
								<CraftButton id={cres[0]} amt=25 />
							</div>
							<div class="col-span-2 pr-1 py-0 mainText">
								<CraftButton id={cres[0]} amt=1000 />
							</div>
								
					{/if}
				{/each}

					</div>
				</div>
			</div>

				<!-- Game Tab Buttons go here -->
			<div class='p-4 col-span-6 items-start mb-12'>
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
						{#if $fameTab['gloryLevel'] >= 2 && $buildCounts['town hall'][0] > 0}
							{#if $fameTab['gloryLevel'] >= 2 && $buildCounts['town hall'][0] > 0}
							<div class='flex'>
								<TabButton on:click={() => changeTab('policy')} text='Policy'/>
							</div>
							{:else}
							<div class='flex'>
								<TabButton text='Lv 3'/>
							</div>
							{/if}
						{/if}

						{#if $fameTab['gloryLevel'] >= 1}
							{#if $res['karma'][0] > 0 && $fameTab['gloryLevel'] >= 2}
							<div class='flex'>
								<TabButton on:click={() => changeTab('religion')} text='Religion'/>
							</div>
							{:else}
							<div class='flex'>
								<TabButton text='Lv 4'/>
							</div>
							{/if}
						{/if}

						{#if $fameTab['gloryLevel'] >= 1}
							{#if $fameTab['gloryLevel'] >= 1}
							<div class='flex'>
								<TabButton on:click={() => changeTab('stardust')} text='Stardust'/>
							</div>
							{:else}
							<div class='flex'>
								<TabButton text='Lv 5'/>
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
							{#if $researched['builds'].has(build[0].toLowerCase()) &&
									 $visible['builds'].has(build[0].toLowerCase())}
							<div class='p-1'>
								<BuildingButton id={build[1]['name'].toLowerCase()}
								text={build[1]['toggleable'] ? 
								build[1]['name'] + " (" + $buildCounts[build[1]['name'].toLowerCase()][1] + " / " + $buildCounts[build[1]['name'].toLowerCase()][0] + ")" :
								build[1]['name']+ " (" + $buildCounts[build[1]['name'].toLowerCase()][0] + ")"}/>
							</div>
							{/if}
							{/each}

							<div class='p-1'></div>

						</div>
					</div>
				{/if}

				{#if activeTab == 'science'}
					<label>
						<input type=checkbox bind:checked={showUnlockedSciences}>
						<span class='gameTextWhite select-none'>Show already researched technologies</span>
					</label>
					{#each Object.entries($science) as sci}
						{#if ((!($researched['science'].has(sci[0])) || showUnlockedSciences)) && $visible['science'].has(sci[0])}
						<div class='p-1'> 
							<ScienceButton id={sci[0].toLowerCase()} class='p-1' 
							text={sci[1]['name']}/>
						</div>
						{/if}
					{/each}
				{/if}

				{#if activeTab == 'fame'}
					<div class='p-2'>
					</div>
					<br/>
					<div>
						<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
  						<div class="mainText progbar-fame bg-orange-400 h-2.5 rounded-full" style="width: {Math.min($res.glory[0] / gloryNextLevelTarget * 100, 100)}% "></div>
						</div>
					</div> 
					<div class='text-center gameTextWhite pt-1 mainText'>You are glory level <strong>{$fameTab['gloryLevel']}</strong></div>
					<div class='text-center gameTextWhite'>You need {round(Math.max(gloryNextLevelTarget - $res.glory[0], 0))} glory to reach the next level.</div>
					<div class='p-1 text-center mainText gameTextWhite'>Your glory level grants +{round((fm.calcGloryBonusProduction($fameTab['gloryLevel'])-1) * 100)}% to all production.</div>
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

				{#if activeTab == 'policy'}
				<div class='py-2'></div>
				<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
  				<div class="mainText progbar-fame bg-green-300 h-2.5 rounded-full" style="width: {
  					($policyTab['policiesResearched'] % 10) * 10}% "></div>
					</div>
				<div class='text-center gameTextWhite pt-1 mainText'>Unlock {((($policyTab['policyLevel']+1) * 10) - ($policyTab['policiesResearched']))} more policies to gain a bonus to all of them. </div>

				<div class='text-center gameTextWhite pt-1 mainText'>Current bonus to all policies: <strong>{round(fm.calcPolicyGlobalBonus($policyTab['policyLevel']))}%</strong></div>
				<div class='p-3'><hr/></div>
				<label>
					<input type=checkbox bind:checked={showUnlockedPolicy}>
					<span class='gameTextWhite select-none'>Show already researched policies</span>
				</label>
					{#each Object.entries($policy) as pol}
						{#if (!($researched['policy'].has(pol[0])) || showUnlockedPolicy) && $visible['policy'].has(pol[0])}
					<div class='p-1 grid'>
						<div class='row'>
							<PolicyButton id={pol[1]['id']} class='p-1'/>
						</div> 
					</div> 
					{/if}
					{/each}
				{/if}

				{#if activeTab === 'religion'}
					<div class='py-2'></div>
					<KarmaConvertButton />
					<div class='py-1'></div>
					{#if $religionTab['karmaBanked'] > 0}
						<div class='pb-1 gameTextWhite text-center'>Karma Banked: 
						{round($religionTab['karmaBanked'])}</div>
						<div class='pb-1 text-small-gray text-center'>
							Converting more karma at once will give a bonus to the total amount.
						</div>
						<div class='py-2'></div>
						<LightConvertButton />
					{/if}
				{/if}

				{#if activeTab === 'stardust'}
						<div class='py-2'></div>
						<div class='pb-1 text-small-gray text-center'>
							Ascending resets everything up to this point, but grants stardust in return.
						</div>
						<div class='pb-1 gameTextWhite text-center'>You will gain 
							<strong>{stardustGain[0] >= 1000 ? round(stardustGain[0],3) : round(stardustGain[0],0)}
								</strong> stardust if you ascend now.
					</div>
							<div class='text-small-gray text-center col-span-4 grid-cols-2'>
								Base: +<strong>{round(stardustGain[1]+stardustGain[2]+stardustGain[5],3)}</strong> (glory, policies, magic)
								</div>
							<div class='text-small-gray text-center col-span-4'>
								Multiplier: x<strong>{round(stardustGain[3]*stardustGain[4],3)}</strong> (religion, time)
							</div>
						<div class='py-1'></div>
						<StardustResetButton resetFunc={() => stardustReset()}/>	
						<div class='py-2'></div>
						{#if $res['stardust'][0] > 0 || fm.sumArray($stardustTab['basicUpgrades']) > 0}
							<div class='grid grid-cols-3 items-center'>
								{#each $stardustBasics as star, i}
								<div class='col-span-1 py-1'>
									<StardustBasicUpgradeButton index={i} />
								</div>
								 {/each}
							</div>
							<div class='py-2'></div>
							<div class='grid grid-cols-1 items-center'>
								{#each $stardustGenerators as star, i}
								<div class='col-span-1 py-1'>
									<StardustGeneratorButton index={i} />
								</div>
								 {/each}
							</div>
					{/if}
				{/if}
				
			</div>

			<div class='p-4 col-span-2 items-start mb-12'></div>
		</div>
</div>


<script>
// @ts-nocheck
	import BuildingButton from '../components/buttons/BuildingButton.svelte';
	import ScienceButton from '../components/buttons/ScienceButton.svelte';
	import ClickButton from '../components/buttons/ClickButton.svelte';
	import CraftButton from '../components/buttons/CraftButton.svelte';
	import SaveLoadButton from '../components/buttons/SaveLoadButton.svelte';
	import TabButton from '../components/buttons/TabButton.svelte';
	import PolicyButton from '../components/buttons/PolicyButton.svelte'
	import QuestSubmitButton from '../components/buttons/QuestSubmitButton.svelte';
	import QuestRefreshButton from '../components/buttons/QuestRefreshButton.svelte';
	import QuestUpgradeButton from '../components/buttons/QuestUpgradeButton.svelte';
	import KarmaConvertButton from '../components/buttons/KarmaConvertButton.svelte';
	import LightConvertButton from '../components/buttons/LightConvertButton.svelte';
	import StardustResetButton from '../components/buttons/StardustResetButton.svelte';
	import StardustBasicUpgradeButton from '../components/buttons/StardustBasicUpgradeButton.svelte'
	import StardustGeneratorButton from '../components/buttons/StardustGeneratorButton.svelte';
	import { res, baseRes, gloryBonuses, totalRes, craftRes, baseCraftRes, fameTab, baseFameTab, policyTab, basePolicyTab, unlockedResources, visible, researched, craftTier, policyBonuses,
	religionTab, stardustTab, baseStardustTab, flags} from '../data/player.js';
	import { builds, allGens, allSubtracts, allBonuses, resDeltas, buildCounts, baseAllGens, baseBuildCounts } from '../data/buildings.js';
	import { science } from '../data/science.js';
	import {jobs, baseJobs} from '../data/jobs.js'
	import {stardustBasics, stardustGenerators} from '../data/stardust.js'
	import { policy } from '../data/policy';
	import {onMount, onDestroy} from 'svelte';
	import {get} from 'svelte/store'
	import fm from '../calcs/formulas.js'
	import tb from '../calcs/tables.js'

	// REACTIVE_VARS
	$: numBuildings = Object.entries(get(builds)).length;
	$: numScience = Object.entries(get(science)).length;
	$: numPolicy = Object.entries(get(policy)).length;
	let saveInterval;
	let checkResUnlockInterval;
	$: currRes = Object.entries(get(res));
	$: gloryBuffs = Object.entries(get(gloryBonuses));
	let stardustGain = [0,0,0,0,0];
	let timeBonusDisplay = 0;
	$: {
				stardustGain = fm.calcStardustGain(
								$fameTab['gloryLevel'],
								$policyTab['policiesResearched'],
								//TODO: edit below call to include light (change the '0' to light value)
								fm.calcKarmaPoints($religionTab['karmaBanked'], 0),
								$stardustTab['lastReset'],
							  $stardustTab['basicUpgrades'])

			}
		

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
		magic: 'text-indigo-500',
		favor: 'text-emerald-500',
		karma: 'text-teal-200',
		stardust: 'text-fuchsia-400',

		// craftable resources
		steel: 'text-slate-400',
		alloy: 'text-slate-400',
		spring: 'text-slate-400',
		journal: 'text-cyan-400'
	}

	// NONREACTIVE_VARS
	let gloryLockout = true;
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

	let gloryNextLevelTarget = fm.findGloryNextTarget(get(fameTab)['gloryLevel']) 
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



		// fix base buildings/science loadouts if there is a discrepancy
		//baseBuilds.setSelf(get(builds));
		//baseScience.setSelf(get(science));
		// if there is save data, load it
		if (localStorage.getItem('data') !== null) {
			const loader = setTimeout(() => {
				if (!(load())) {
					buildCounts.init();
				};
				// adds new content, if needed
				//();
				console.log('update1')
				allGens.updateAll();
				allSubtracts.updateAll();
				allBonuses.updateAll();
				resDeltas.updateAll();
				updateCaps();
			}, 1000)
		}
		console.log(get(buildCounts))

		$unlockedResources = new Set([...$unlockedResources, 'kelp'])	

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
			  	addRes(1000*delta/200);
			});
			if ($flags['updateCapFlag']) {
				updateCaps();
				$flags['updateCapFlag'] = 0;
			}
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

			// updates the time bonus display on the stardust tab
			timeBonusDisplay = round(fm.calcTimeBonus($stardustTab['lastReset'], $stardustTab['basicUpgrades']),3);

			// level up if player has enough glory for the next level
			if (get(res)['glory'][0] >= gloryNextLevelTarget && !gloryLockout) {
				fameTab.add('gloryLevel', 1);
				res.sub('glory', gloryNextLevelTarget)
				gloryNextLevelTarget = fm.findGloryNextTarget(get(fameTab)['gloryLevel'] + 1)
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
		// update the number of policies researched
		policy.setPoliciesResearched();
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
		//science.checkCriteria();
		//policy.checkCriteria();
	}

			// resets caps then updates them again
		// only use when initially loading the page, in case updates need to be applied
		// bc it's slow
	function updateCaps() {
				console.log('CAPS UPDATING')
				for (let [type,val] of Object.entries($res)) {
					res.setCap(type, $baseRes[type][1]);
				}
				const b = get(builds)
				for (let [key, val] of Object.entries($buildCounts)) {
					console.log(key);
						if (b[key] && typeof key === 'string' && b[key]['caps']) {
							for (let [k,v] of Object.entries(b[key]['caps'])) {
										const policyBonus = 1 + ($policyBonuses[key] || 0)
	      						res.addCap(k, v*val[0]*policyBonus);
	      					}
	   				 	}
				}
				// stardust upgrade
				const favorCapInc = $stardustTab['basicUpgrades'][3] * 5;
				$res['favor'][1] += favorCapInc
				
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
		savestr['craftTier'] = get(craftTier)
		savestr['res'] = get(res);
		savestr['totalRes'] = get(res);
		savestr['craftRes'] = get(craftRes);
		savestr['buildCounts'] = get(buildCounts);
		console.log(savestr['buildCounts'])
		savestr['allGens'] = get(allGens);
		savestr['allSubtracts'] = get(allSubtracts);
		savestr['resDeltas'] = get(resDeltas)
		savestr['fameTab'] = get(fameTab);
		savestr['unlockedResources'] = [...$unlockedResources]; // convert set to array to store
		savestr['jobs'] = get(jobs)
		savestr['visible'] = [[...get(visible)['builds']], [...get(visible)['science']], [...get(visible)['policy']]]
		savestr['researched'] = [[...get(researched)['builds']], [...get(researched)['science']], [...get(researched)['policy']]]
		savestr['policyTab'] = get(policyTab);
		savestr['religionTab'] = get(religionTab);
		savestr['stardustTab'] = get(stardustTab);

		savestr = btoa(JSON.stringify(savestr));
		localStorage.setItem('data', savestr);
	}

	function load() {
		try {


			const savestr = JSON.parse(atob(localStorage.getItem('data')));
			// const savedata = savestr.split("} ")
			res.setSelf(savestr['res'] || get(baseRes));
			craftRes.setSelf(savestr['craftRes'] || get (baseCraftRes));
			// fixes any changes in the base res caps
			// also adds any new resources to the player's local data
			for (let [key, val] of Object.entries($baseRes)) {
				if (!($res[key])) $res[key] = val;
				if (val[1] != $res[key][1]) $res[key][1] = val[1];
			}
			for (let [key, val] of Object.entries($baseCraftRes)) {
				if (!($craftRes[key])) $craftRes[key] = val;
				if (val[1] != $craftRes[key][1]) $craftRes[key][1] = val[1];
			}

			totalRes.setSelf(savestr['totalRes'] || get(totalRes));
			buildCounts.setSelf(savestr['buildCounts'] || get(baseBuildCounts));
			fameTab.setSelf(savestr['fameTab'] || get(baseFameTab));
			console.log()
			jobs.setSelf(savestr['jobs'] || get(baseJobs));
			$craftTier = savestr['craftTier'] || 0;
			visible.setSelf({
				builds: new Set(savestr['visible'][0]),
				science: new Set(savestr['visible'][1]),
				policy: new Set(savestr['visible'][2]),
			})
			researched.setSelf ({
				builds: new Set(savestr['researched'][0]),
				science: new Set(savestr['researched'][1]),
				policy: new Set(savestr['researched'][2]),
			})


			$unlockedResources = new Set(Object.values(savestr['unlockedResources']));	

			if (savestr['policyTab']) policyTab.setSelf(savestr['policyTab'])
			policyTab.set('policyLevel', Math.floor($policyTab['policiesResearched'] / 10))
			if (savestr['religionTab']) religionTab.setSelf(savestr['religionTab']);
			if (savestr['stardustTab']) stardustTab.setSelf(savestr['stardustTab']);
			policyBonuses.add('global', fm.calcPolicyGlobalBonus($policyTab['policyLevel']))
			gloryProdBonus = fm.calcGloryBonusProduction($fameTab['gloryLevel']);
			gloryNextLevelTarget = fm.findGloryNextTarget(get(fameTab)['gloryLevel']);
			gloryLockout = false;
			allGens.updateAll();
			allSubtracts.updateAll();
			allBonuses.updateAll();
			resDeltas.updateAll();
			builds.checkSciCriteria();
			science.checkCriteria();
			policy.checkCriteria();
			policy.updateAll();
			if ($stardustTab['basicUpgrades'].length < 12){
				$stardustTab['basicUpgrades'] = [...$stardustTab['basicUpgrades'],0,0,0]
			}
			if (!($stardustTab['generators']) || $stardustTab['generators'].length < 4) {
				$stardustTab['generators'] = [0,0,0,0]
			}

			for (let i of Object.entries($baseRes)) {
				if ($res[i[0]] === undefined) {
					$res[i[0]] = i[1];
					$totalRes[i[0]] = i[1];
				}
			}

			for (let i of Object.keys($builds)) {
				if (!($buildCounts[i])) $buildCounts[i] = [0,0];
			}


			return true;
		} catch (e) {
			console.log(e)
			alert('Loading Error! Press "OK" to reset the game, or try again.')
			//reset();
			return false;
		} finally {
			console.log('loading complete!')
		}
	}

	// this will apply all science bonuses from any researched sciences
	function applyAllScience() {
		for (let i of Object.entries(get(science))) {
			if (i[1]['researched']) {
				science.updateSpecialCase(i[0]);
			}
		}
	}

	function stardustReset() {
		const s = stardustGain[0] + $res['stardust'][0];
		$stardustTab['lastReset'] = Date.now();
		baseRes.clear();
		res.setSelf(get(baseRes));
		craftRes.setSelf(get(baseCraftRes));
		//automatic fame banking
   	$fameTab['gloryLevel'] = 1;
   	console.log($policyTab);
    policyTab.reset();

    // set job upgrades to level 0
    for (let j of $fameTab['jobUpgrades']) {
    	j['level'] = 0;
    }

		buildCounts.init();
		science.lockAll();
		policy.lockAll();
		$unlockedResources = new Set(['kelp', 'stardust']);
		visible.setSelf({
			builds: new Set(),
			science: new Set(),
			policy: new Set(),
		})
		researched.setSelf({
			builds: new Set(['kelp farm']),
	 		science: new Set(),
	 		policy: new Set()
	 	})
	 	builds.checkSciCriteria();
	 	$craftTier = 0;
		activeTab = 'main';
		jobs.setSelf(get(baseJobs));
		allGens.updateAll();
		allSubtracts.updateAll();	
		allBonuses.updateAll();
		resDeltas.updateAll();
		builds.hideAll();
		//science.checkCriteria();
		//initVisRes();
		religionTab.reset();
		$religionTab['karmaBanked'] = 0;
		res.add('stardust', s);
		totalRes.add('stardust', s);
		res.add('kelp', 20);
		console.log($policyTab['policiesResearched']);

		save();
		location.reload();
	}

	function reset() {
	 	// let confLeft = 5;
	 	// if (!confirm("ARE YOU SURE you want to reset? This is a HARD reset and will clear everything! (Additional confirmation required after this)")) {
	 	// 	return;
	 	// }
	 	// let confText = prompt("Please type \"I want to reset the game.\" EXACTLY as shown (without quotes) to reset.");
	 	// if (confText !== "I want to reset the game.") {
	 	// 	return;
	 	// }
		baseRes.clear();
		console.log(get(baseRes));
		res.setSelf(get(baseRes));
		craftRes.setSelf(get(baseCraftRes));
		//automatic fame banking
		let bankAmt = get(res)['fame'][0]
    res.setItem('fame', 0);
    res.add('glory', bankAmt);
    science.setSelf(get(science));
    policy.setSelf(get(policy));
    fameTab.setSelf(get(baseFameTab));
   	$fameTab['gloryLevel'] = 1;
    policyTab.setSelf(get(basePolicyTab));
		buildCounts.init();
		science.lockAll();
		policy.lockAll();
		$unlockedResources = new Set(['kelp']);
		visible.setSelf({
			builds: new Set(),
			science: new Set(),
			policy: new Set(),
		})
		researched.setSelf({
			builds: new Set(['kelp farm']),
	 		science: new Set(),
	 		policy: new Set()
	 	})
	 	builds.checkSciCriteria();
	 	$craftTier = 0;
		activeTab = 'main';
		jobs.setSelf(get(baseJobs));
		allGens.updateAll();
		allSubtracts.updateAll();	
		allBonuses.updateAll();
		resDeltas.updateAll();
		builds.hideAll();
		//science.checkCriteria();
		console.log($visible)
		//initVisRes();
		console.log(get(builds));

		$religionTab['karmaBanked'] = 0;
		stardustTab.setSelf($baseStardustTab);
		localStorage.clear();
		save();
		location.reload();
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
	:global(.text-white) {
		color:  white;
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
 :global(.game-btn-noafford) {
    border: 1px solid #696969;
    color: #696969;
    cursor: pointer;
  }
 	:global(.game-btn-nostorage) {
    border: 1px solid #ef4444;
    color: #d9363e;
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
  :global(.text-white) {
  	color:  white;
  }
  :global(.text-nostorage){
  	color: #ef4444;
  }
  :global(.text-noafford){
  	color: #696969;
  }
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }

</style>