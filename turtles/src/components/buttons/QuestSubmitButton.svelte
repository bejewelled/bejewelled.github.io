<div class='has-tooltip gameText py-1 items-center text-center border-solid ml-1 mr-1
     {affordStyle}
     select-none'
     on:click={() => submit(index)} >{text}
     {#if $jobs[index]['cooldown']}
     <div class='bg-gray-400 items-center text-center"'style="width:{(1 - ($jobs[index]['nextTime'] - Date.now()) / $jobs[index]['initcd']) * 100}%"></div>
     {/if}
</div>


<script>
// @ts-nocheck

  import { res, unlockedResources } from '../../data/player.js';
  import { builds, allGens, allBonuses, buildCounts, allSubtracts, resDeltas } from '../../data/buildings.js';
  import {jobs} from '../../data/jobs.js'
  import  fm  from '../../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'

  let text;
  export let index;
  let affordStyle;
  let toggleAffordStyle;
  let lockoutStyle;

  const decround = (n, places) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
  };

  let cooldownStyleInterval;

  onMount(() => { 
	affordStyle = setAffordStyle(index);
	text = setText(index); 
  	cooldownStyleInterval = setInterval(() => {
  		affordStyle = setAffordStyle(index);
  		text = setText(index); 
  	}, 500)
  })

  onDestroy(() => {
  	clearInterval(cooldownStyleInterval);
  })


  function submit(index) { 
    let type = get(jobs)[index]['type']
    let amount = get(jobs)[index]['amount']
    let reward = get(jobs)[index]['reward']

    if (get(jobs)[index]['cooldown']) return;

    if (get(res)[type][0] >= amount) {
      res.sub(type, amount);
      res.add('glory', reward);
      unlockedResources.set(new Set([...get(unlockedResources), 'glory']))
      jobs.remJob(index);
    }

  }


  function formatToTime(t) {
    let text = '';
    if (t > 3600) {
      text += Math.floor(t/3600).toString() + "h "
      t -= 3600*Math.floor(t/3600);
    }
    if (t >= 60) {
      text += Math.floor(t/60).toString() + "m "
      t -= 60*Math.floor(t/60);
    }
    text += Math.round(t).toString() + "s"
    return text;
  }

  function setAffordStyle(index) {
  	if (get(jobs)[index]['cooldown']) { 
  		return "game-btn-noafford cursor-no-drop";
  	} else {
  		return "game-btn";
  	}
  }

  function setText(index) {
  	if (get(jobs)[index]['cooldown']) {
  		return formatToTime((get(jobs)[index]['nextTime'] - Date.now()) / 1000)
  	} else {
  		return 'Finish Job'
  	}
  }

// all code logic
</script>



<style>
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }
</style>