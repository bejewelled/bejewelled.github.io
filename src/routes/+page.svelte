<div class='container'>
	<div class="grid items-center grid-cols-12 p-3">
		<div class='p-1 col-span-3'>
			<div class='grid grid-rows-12 items-baseline'>
				<div class='grid grid-cols-12 items-start'>
					{#each currRes as res}
					{#if res[1][0] > 0}
					<div class='col-span-4 mainText'>{res[0]}</div>	
					<div class='col-span-5 text-left mainText'>{round(res[1][0], 3)} / {round(res[1][1], 3)}</div>	<div class='col-span-3 text-left mainText'>+{round($allGens[res[0]]*5, 3)} / sec</div>
					{/if}	
					{/each}

				</div>
							</div>
		</div>

		<div class='p-4 col-span-5'>
			<div class='grid-rows-12'>
				<div class='p-1 grid grid-cols-2 items-center'>
					<div class='p-1'>
						<ClickButton text={'Gather Kelp'} on:click={kelpClick}></ClickButton>
					</div>
					<!-- change the length each time you add a building !-->
					{#each {length: 4} as _, i}
					<div class='p-1'>
						<BuildingButton id={i} class='p-1' 
						text={$builds[i]['name'] + " (" + $builds[i]['count'] + ")"}/>
					</div>
					{/each}

					<div class='p-1'>

					</div>
			</div>
		</div>

		<div class='col-span-4'>
		</div>
	</div>

</div>
</div>


<script>
import BuildingButton from '../components/BuildingButton.svelte';
import ClickButton from '../components/ClickButton.svelte';
import { res } from '../data/player.js';
import { builds, allGens } from '../data/buildings.js';
import {onMount, onDestroy} from 'svelte';
import {get} from 'svelte/store'

let lastTick = performance.now()
let currRes = Object.entries(get(res));

onMount(() => {
	let rid = requestAnimationFrame(function update() {
		let now = performance.now()
	  	const delta = now - lastTick
	  	lastTick = now
	});
	setInterval(function () {
		rid = requestAnimationFrame(function update() {
			let now = performance.now()
		  	const delta = now - lastTick
		  	lastTick = now
		  	//res.add('kelp', 0.004*(delta/200))
		  	currRes = Object.entries(get(res));
		  	addRes();
		});
	}, 200 );
});

let getLength = ((obj) => {
	return Object.keys(obj).length;
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

function addRes() {
	console.log(get(allGens));
	console.log('as')
	res.addMany(get(allGens));
}



function kelpClick() {
	res.add('kelp', 1);

}



</script>


<style>
	:global(body) {
		background-color: #222529;
	}
	:global(.mainText) {
		color: white;
		font-size: 10px;
	}

</style>