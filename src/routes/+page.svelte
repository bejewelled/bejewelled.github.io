<div class='container'>
	<div class='grid mainText row header-bar h-[3px] p-1'>
		<div class='grid grid-cols-12 items-start'>
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
		<div class="grid row items-start grid-cols-12 p-3">

				<!-- Resource Displays -->
				<div class='p-1 col-span-3'>
					<div class='grid grid-rows-12 items-start'>
						<div class='grid grid-cols-12 items-start'>


			{#each currRes as res}
				{#if res[1][0] > 0}
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
						{#if $allGens[res[0]] >= 0}+{:else}-{/if}
						{#if Math.abs($allGens[res[0]]) >= 0.0000199}
							{round($allGens[res[0]]*5*(1+$allBonuses[res[0]]/100 || 1), 3)} / sec
						{:else}
							... / sec
						{/if}
					{/if}


							<!-- production tooltip -->
	            <span class='w-[160px] 
	            grid row tooltip shadow-lg p-1 border-white border bg-[#222529] ml-16'>
				        <div class='grid row grid-cols-12 items-start pb-1'>
									<span class='col-span-7 text-left'>
										Production: 
									</span>
									<span class='col-span-5 text-left'>
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
									<span class='col-span-5 text-left'>
										{#if $allBonuses[res[0]] > -0.0003}+{:else}-{/if}
										{round($allBonuses[res[0]], 3)}%
									</span>
								</div>
								{/if}
								{#if res[1][1] > 0}
								<hr/>
				            	<div class='grid row grid-cols-12 pt-1 text-left'>							
					              	<span class='col-span-7'>Time until cap: </span>
					              	<span 
					              	class='col-span-5 text-left {timeToCap(res) <= 0.0003 ? "text-rose-400" : 
					              	timeToCap(res) <= 120 ? "text-orange-400" : "text-white"}'>
					              	{fm.formatToTime(Math.round((res[1][1] - res[1][0]) / (5*$allGens[res[0]])))}
					              	</span>
				           	 	</div>
				        {/if}
				            </span>
	            	</div>
						{/if}	
			{/each}

						</div>
					</div>
				</div>

				<!-- Game Tab Buttons go here -->
				<div class='p-4 col-span-5 items-start'>
					<div class='flex flex-row'>
						<div class='flex'>
							<TabButton on:click={() => changeTab('main')} text='Buildings'/>
						</div>
					{#if $res['science'][0] > 0.01}
						<div class='flex'>
							<TabButton on:click={() => changeTab('science')} text='Science'/>
						</div>
					{/if}
					{#if $res['fame'][0] > 0.01}
						<div class='flex'>
							<TabButton on:click={() => changeTab('fame')} text='Fame'/>
						</div>
					{/if}
				</div>

				<!-- Game Tab Content goes here -->
				{#if activeTab == 'main'}
					<div class='grid row'>
						<div class='p-1 grid grid-cols-2 items-center'>
							<div class='p-1'>
								<ClickButton text={'Gather Kelp'} on:click={kelpClick}></ClickButton>
							</div>
							<!-- change the length each time you add a building !-->
							{#each {length: numBuildings} as _, i}
							{#if $builds[i]['available'] && $builds[i]['visible']}
							<div class='p-1'>
								<BuildingButton id={i} 
								text={$builds[i]['toggleable'] ? 
								$builds[i]['name'] + " (" + $buildCounts[i][1] + " / " + $buildCounts[i][0] + ")" :
								$builds[i]['name'] + " (" + $buildCounts[i][0] + ")"}/>
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

				{#if activeTab == 'fame'}
					<div class='p-2'>
					</div>
					<div class='p-2 grid'>
						<div class='row'>
							<FameBankButton class='p-1'/>
						</div> 
					</div> 
				{/if}


				<div class='col-span-4'></div>
			</div>
		</div>
</div>


<script>
	import BuildingButton from '../components/BuildingButton.svelte';
	import ScienceButton from '../components/ScienceButton.svelte';
	import ClickButton from '../components/ClickButton.svelte';
	import SaveLoadButton from '../components/SaveLoadButton.svelte';
	import TabButton from '../components/TabButton.svelte';
	import FameBankButton from '../components/FameBankButton.svelte';
	import { res, baseRes, gloryBonuses } from '../data/player.js';
	import { builds, allGens, allBonuses, buildCounts, baseBuilds, baseAllGens, baseBuildCounts } from '../data/buildings.js';
	import { science, baseScience } from '../data/science.js';
	import {onMount, onDestroy} from 'svelte';
	import {get} from 'svelte/store'
	import fm from '../calcs/formulas.js'

	$: numBuildings = Object.entries(get(builds)).length;
	$: numScience = Object.entries(get(science)).length;
	let saveInterval;
	let checkResUnlockInterval;
	$: currRes = Object.entries(get(res));
	$: gloryBuffs = Object.entries(get(gloryBonuses));

	// sets display color for the resource name
	let colors = {
		default: 'text-white',
		kelp: 'text-white',
		sand: 'text-white',
		wood: 'text-white',
		iron: 'text-white',
		coal: 'text-white',
		fame: 'text-orange-400',
		glory: 'text-amber-300',
		science: 'text-sky-500'
	}


	let activeTab = 'main';
	let showUnlockedSciences = false;
	let getLength = ((obj) => {
		return Object.keys(obj).length;
	});
	let timeToCap = ((res) => {
		return Math.round((res[1][1] - res[1][0]) / (5*get(allGens)[res[0]]))
	});

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

  const round = (n, places) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
  };




	// onMount
	let lastTick = performance.now()

	onMount(() => {

		// init build count list
		buildCounts.init(100);

		// fix base buildings/science loadouts if there is a discrepancy
		//baseBuilds.setSelf(get(builds));
		//baseScience.setSelf(get(science));
		console.log(get(baseBuilds));
		// if there is save data, load it
		if (localStorage.getItem('data') !== null) {
			load();
			// adds new content, if needed
			fixContent();
			allGens.updateAll();
		}

		// start main game loop
		let rid = requestAnimationFrame(function update() {
			let now = performance.now()
		  	const delta = now - lastTick
		  	lastTick = now
		});

		// main game loop
		setInterval(function gameLoop() {
			rid = requestAnimationFrame(function update() {
				let now = performance.now()
			  	const delta = now - lastTick
			  	lastTick = now
			  	currRes = Object.entries(get(res));

			  	addRes(50*delta/200);
			});
		}, 200);

//		save every 30s (this time doesn't have to be accurate so don't need to use dt)
		saveInterval = setInterval(function savegame() {
			save();
		}, 30000);

		// check for new unlocks every second
		checkResUnlockInterval = setInterval(() => { 
			builds.checkSciCriteria();
			for (let c in Object.entries(get(builds))) {
      	builds.checkResUnlockThreshold(c[0]);
    	}
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
				}
		}
		for (let [id, obj] of Object.entries(get(science))) {
				if (!(existingSci[id] === undefined) && existingSci[id]['researched'] == true) {
					science.unlock(id);
				}
		}
		builds.checkSciCriteria();
		allGens.updateAll();
		allBonuses.updateAll();
		science.checkCriteria();
		for (let id of Object.entries(get(science))) {
			if (id[1]['researched']) {
				science.updateSpecialCase(id[0]);
			}
		}
	}

//--------------

	function changeTab(tab) {
		activeTab = tab;
	}

	let counter = 0;
	function addRes(delta) {
		let basegens = get(allGens);
		let bonuses = get(allBonuses);
		for (let k in basegens) {
			// if (!(bonuses[k] === undefined)) {
			// 	basegens[k] *= (1 + bonuses[k]/100);
			// }
		}
		res.addMany(basegens, delta);
		basegens = get(allGens);
		counter++;
		if (counter > 5) {
			counter = 0;
			allGens.updateAll();
			allBonuses.updateAll();
		}
  }

	function kelpClick() {
		res.add('kelp', 1);
	}

	function save() {
		const savedata= [get(res), get(builds), get(buildCounts), get(allGens)];
		// const saveres = get(res);
		// const savebuilds = get(builds);
		// const savebuildcounts = get(buildCounts);
		// const savegens = get(allGens);
		let savestr = {}
		savestr['res'] = get(res);
		savestr['builds'] = get(builds);
		savestr['buildCounts'] = get(buildCounts);
		savestr['allGens'] = get(allGens);
		savestr['science'] = get(science);
		savestr = btoa(JSON.stringify(savestr));
		localStorage.setItem('data', savestr);
	}

	function load() {
		const savestr = JSON.parse(atob(localStorage.getItem('data')));
		// const savedata = savestr.split("} ")
		res.setSelf(savestr['res']);
		builds.setSelf(savestr['builds']);
		buildCounts.setSelf(savestr['buildCounts']);
		science.setSelf(savestr['science']);
		allGens.updateAll();
		allBonuses.updateAll();
		builds.checkSciCriteria();
		science.checkCriteria();
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
	 	if (!confirm("ARE YOU SURE you want to reset? This is a HARD reset and will clear everything!")) {
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

		builds.setSelf(get(baseBuilds));
		console.log(get(builds))
		console.log(get(baseBuilds));
		buildCounts.init(100);
		science.setSelf(get(baseScience));
		science.lockAll();
		science.checkCriteria();
		activeTab = 'main';
		allGens.updateAll();	
		builds.hideAll();
		save();
	 }
</script>


<style>
	:global(body) {
		background-color: #222529;
	}
	:global(.mainText) {
		font-size: 10px;
	}
	:global(.game-text-size) {
		font-size: 10px;
	}
	:global(.gameText) {
		font-size: 10px;
	}
	:global(.gameTextWhite) {
		font-size: 10px;
		color: white;
	}
	:global(.text-small-gray) {
    font-size: 10px;
    color: gray;
  }
  :global(.text-med-gray) {
    font-size: 11px;
    color: gray;
  }
  :global(.text-small-gray) {
    font-size: 10px;
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