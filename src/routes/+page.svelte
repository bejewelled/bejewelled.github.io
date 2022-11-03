<div class='container'>
	<div class="grid items-center grid-cols-12 p-3">
		<div class='p-1 col-span-3'>
			<div class='grid grid-rows-12 items-baseline'>
				<div class='grid grid-cols-12 items-start'>
					<div class='col-span-4 mainText'>food</div>
					<div class='col-span-6 text-left mainText'>{round($res['kelp'], 3)} / {round($res['kelpMax'], 3)}</div>
					<div class='col-span-2 text-left mainText'>+1.556/s</div>
				</div>
				<div class='grid grid-cols-12 items-start'>
					<div class='col-span-4 mainText'>unobtanium</div>
					<div class='col-span-6 text-left mainText'>{round($res['sand'], 3)} / {$res['sandMax']}</div>
					<div class='col-span-2 text-left mainText'>+1.556/s</div>
				</div> 
			</div>
		</div>

		<div class='p-4 col-span-5'>
			<div class='grid-rows-12'>
				<div class='p-1 grid grid-cols-2 items-center'>
					<div class='p-1'>
						<ClickButton text={'hello!'} on:click={kelpClick}></ClickButton>
					</div>
					<div class='p-1'>
						<BuildingButton id=0 class='p-1' 
						text={$builds[0]['name'] + " (" + $builds[0]['count'] + ")"}/>
					</div>
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
import { builds } from '../data/buildings.js';
import {onMount, onDestroy} from 'svelte';

let lastTick = performance.now()


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
		  	res.add('kelp', 0.004*(delta/200))
		  	console.log(delta);
		});
	}, 200 );
});


// number rounder. Use 3 decimals as default
// add more when needed (like thousands, etc)
let round  = ((i, places) => {
	let s = ''; // shortener
	if (i > 9750) {
		i /= 1000;
		s = 'K';
	}
 	return (Math.ceil(i*Math.pow(10,places))/Math.pow(10,places)).toString() + s;
})

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