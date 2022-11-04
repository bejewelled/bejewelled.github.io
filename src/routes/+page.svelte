<div class='container'>
	<div class='grid mainText row header-bar h-[3px] p-1'>
		<div class='grid grid-cols-12 items-start'>
			<div class='col-span-3'>
				<SaveLoadButton on:click={() => save()} text='Save'/>
			</div>
			<div class='col-span-5'>

			</div>
		</div>
	</div>
		<div class="grid row items-start grid-cols-12 p-3">
			<div class='p-1 col-span-3'>
				<div class='grid grid-rows-12 items-start'>
					<div class='grid grid-cols-12 items-start'>
					{#each currRes as res}
					{#if res[1][0] > 0}
					<div class="col-span-4 mainText">
					<span class="{colors[res[0]]}">{res[0]}
					</span></div>	
					<div class='col-span-5 text-left mainText'>
						<span
						class='{res[1][0] > res[1][1]*0.9997 ? "text-rose-400" : 
						res[1][0] > res[1][1]*0.85 ? "text-orange-400" : "text-white"}'>{round(res[1][0], 3)}
						</span>
					 	<span class='gameTextWhite'> / {round(res[1][1], 3)}</span>	
					</div>

				<div class='col-span-3 text-left mainText gameTextWhite 
				has-tooltip mainText select-none'>
				{#if $allGens[res[0]] > 0}+{:else}-{/if}{round($allGens[res[0]]*5, 3)} / sec
						<!-- production tooltip -->
			            <span class='w-[160px] 
			            grid row tooltip shadow-lg p-1 border-white border bg-[#222529] ml-16'>
			            	<div class='grid row grid-cols-12 items-start pb-1'>
								<span class='col-span-7 text-left'>
									Production: 
								</span>
								<span class='col-span-5 text-left'>
									{#if $allGens[res[0]] > 0}+{:else}-{/if}
									{round($allGens[res[0]]*5, 3)} / sec
								</span>
							</div>
							<hr/>
			            	<div class='grid row grid-cols-12 pt-1 text-left'>							
				              	<span class='col-span-7'>Time until cap: </span>
				              	<span 
				              	class='col-span-5 text-left {timeToCap(res) <= 0.0003 ? "text-rose-400" : 
				              	timeToCap(res) <= 120 ? "text-orange-400" : "text-white"}'>
				              	{fm.formatToTime(Math.round((res[1][1] - res[1][0]) / (5*$allGens[res[0]])))}
				              	</span>
			           	 	</div>
			            </span>
            	</div>
					{/if}	
					{/each}

					</div>
				</div>
			</div>

			<!-- Game Tabs go here -->
			<div class='p-4 col-span-5 items-start'>
				<div class='flex flex-row'>
					<div class='flex'>
						<TabButton on:click={() => changeTab('main')} text='Buildings'/>
					</div>
					<div class='flex'>
						<TabButton on:click={() => changeTab('science')} text='Science'/>
					</div>
				</div>

				{#if activeTab == 'main'}
				<div class='grid row'>
					<div class='p-1 grid grid-cols-2 items-center'>
						<div class='p-1'>
							<ClickButton text={'Gather Kelp'} on:click={kelpClick}></ClickButton>
						</div>
						<!-- change the length each time you add a building !-->
						{#each {length: 4} as _, i}
						<div class='p-1'>
							<BuildingButton id={i} class='p-1' 
							text={$builds[i]['name'] + " (" + $buildCounts[i] + ")"}/>
						</div>
						{/each}

						<div class='p-1'>

						</div>
					</div>
				</div>
				{/if}

				<div class='col-span-4'>
				</div>
			</div>
		</div>
</div>


<script>
import BuildingButton from '../components/BuildingButton.svelte';
import ClickButton from '../components/ClickButton.svelte';
import SaveLoadButton from '../components/SaveLoadButton.svelte';
import TabButton from '../components/TabButton.svelte';
import { res } from '../data/player.js';
import { builds, allGens, buildCounts} from '../data/buildings.js';
import {onMount, onDestroy} from 'svelte';
import {get} from 'svelte/store'
import fm from '../calcs/formulas.js'

let lastTick = performance.now()
let currRes = Object.entries(get(res));
let colors = {
	kelp: 'text-white',
	sand: 'text-white',
	wood: 'text-white',
	fame: 'text-orange',
	science: 'text-sky-500'

}
let activeTab = 'main';
let resBlue = ['science'];
let getLength = ((obj) => {
	return Object.keys(obj).length;
});
let timeToCap = ((res) => {
	return Math.round((res[1][1] - res[1][0]) / (5*get(allGens)[res[0]]))
});
// number rounder. Use 3 decimals as default
// add more when needed (like thousands, etc)
let round  = ((i, places) => {
	let s = ''; // shortener
	if (i > 9750) {
		i /= 1000;
		s = 'K';
	}
 	return (Math.floor(i*Math.pow(10,places))/Math.pow(10,places)).toString() + s;
})

onMount(() => {
	console.log(currRes[4][1][2])
	buildCounts.init(100);
	if (localStorage.getItem('data') !== null) {
		load();
	}
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
		  	//res.add('kelp', 0.004*(delta/200))
		  	currRes = Object.entries(get(res));
		  	addRes();
		});
	}, 200 );
	// save every 30s (this time doesn't have to be accurate so don't need to use dt)
	setInterval(function savegame() {
		save();
	}, 30000);
});

function changeTab(tab) {
	activeTab = tab;
}

function addRes() {
	res.addMany(get(allGens));
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
	savestr = btoa(JSON.stringify(savestr));
	localStorage.setItem('data', savestr);
}

function load() {
	// USE THE SAME ORDERING AS SAVE or it will throw an error
	const savestr = JSON.parse(atob(localStorage.getItem('data')));
	// const savedata = savestr.split("} ")
	res.setSelf(savestr['res']);
	builds.setSelf(savestr['builds']);
	buildCounts.setSelf(savestr['buildCounts']);
	allGens.updateAll();
	console.log(savestr['buildCounts']);
 }

</script>


<style>
	:global(body) {
		background-color: #222529;
	}
	:global(.mainText) {
		font-size: 10px;
	}
	:global(.gameText) {
		font-size: 10px;
	}
	:global(.gameTextWhite) {
		font-size: 10px;
		color: white;
	}
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }

</style>