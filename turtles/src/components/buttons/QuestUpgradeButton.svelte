<div 
     on:click={() => buy(index)}
     class='has-tooltip gameText py-1 items-center text-center border-solid ml-1 mr-1
     {affordStyle} col-span-12
     select-none'>{setText(index)}
              <span class='w-[290px] tooltip shadow-lg p-1 border-white border bg-[#222529] ml-16'>
              <div class='title text-small-gray items-start text-center'>{setHeaderText(index)}</div>
              <div class='py-1 text-white-500 mainText'><hr/></div>

              <div class="row">
                <div class='grid items-start grid-cols-5 text-small'>
                <div class="col-span-1 items-start text-left
                {costAffordStyle==='noAfford' ? 'text-red-500' : 'text-white-500'}">fame</div>
                 <div class="col-span-4 text-right pr-1
                 items-baseline {costAffordStyle==='noAfford' ? 'text-red-500' : 'text-white-500'}">{costText}</div>
              </div>
            </div>
              <div class='text-small-gray'>{bonusText}</div>
              </span>
      </div>

<script>
// @ts-nocheck

  import { res, fameTab } from '../../data/player.js';
  import { builds, allGens, allBonuses, buildCounts, allSubtracts, resDeltas } from '../../data/buildings.js';
  import {jobs} from '../../data/jobs.js'
  import  fm  from '../../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'

  let text, costText, bonusText;
  export let index;
  let affordStyle;
  let toggleAffordStyle;
  let lockoutStyle;
  let costAffordStyle;
  let styleInterval

  const decround = (n, places=3) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
  };

  let cooldownStyleInterval;

  onMount(() => { 
    bonusText = setBonusText(index);
	   affordStyle = setAffordStyle(index);
	   text = setText(index); 
  	cooldownStyleInterval = setInterval(() => {
  		affordStyle = setAffordStyle(index);
  		text = setText(index); 
      costText = setCostText(index);
      costAffordStyle = setCostAffordStyle(index);
  	}, 500)
  })

  onDestroy(() => {
  	clearInterval(cooldownStyleInterval);
  })


  function buy(index) {
    if (index == 1 && get(fameTab)['jobUpgrades'][1] > 7) return; // max level of 7
    console.log(index)
    if (get(res)['fame'][0] >= calcCost(index)) {
      let i = get(fameTab);
      res.sub('fame', calcCost(index)); // subtract fame
      i['jobUpgrades'][index]['level']++; // inc level by 1 - cost dynamically updated
      fameTab.setSelf(i); // writeback
      bonusText = setBonusText(index);

      // add a new job slot
      if (index===2) {
        jobs.setSelf([...$jobs,  { 
          index: $jobs.length,
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
        }])
       jobs.addJob($jobs.length-1)
      }
    }
  }


  function formatToTime(t) {
    let text = '';
    if (t < 0) {
      return "inf";
    }
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

  function calcCost(index) {
    const i = get(fameTab)['jobUpgrades'][index]
    return Math.pow(i['ratio'], i['level']) * i['baseCost']
  }

  function setAffordStyle(index) {
    if (get(res)['fame'][0] < calcCost(index)) {
      return "game-btn-noafford cursor-no-drop";
    } else {
  		return "game-btn";
    }	
  }

  function setCostAffordStyle(index) {
    if (get(res)['fame'][0] < calcCost(index)) { 
      return "noAfford";
    } else {
      return "";
    } 
  }


  function setText(index) {
  	switch(index) {
      case 0:
        return 'Upgrade Job Refresh Speed'
      case 1:
        return 'Upgrade Job Maximum Difficulty'
      case 2:
        return 'Increase Number of Jobs'
    }
  }

  function setHeaderText(index) {
    switch(index) {
      case 0:
        return 'Increases the completed job refresh rate by 5%.'
      case 1:
        return 'Increases the maximum difficulty for jobs; higher difficulty jobs reward significantly more glory, but may not be possible. '
      case 2:
        return 'Increase the number of simultaneous job listings by one.'
    }
  }


  function setBonusText(index) {
    switch(index) {
      case 0:
        return 'Current: ' + decround((600* Math.pow(0.95, get(fameTab)['jobUpgrades'][index]['level']))) + 's'
      case 1:
        const val = 4 + get(fameTab)['jobUpgrades'][1]['level']
      case 2:
        return 'Current: ' + (5 + get(fameTab)['jobUpgrades'][index]['level'])
    }
  }

  function setCostText(index) {
      if (index == 1 && get(fameTab)['jobUpgrades'][1]['level'] > 7) return 'This upgrade is at max level.'
      if (get(res)['fame'][0] < calcCost(index)) {
        let remain = calcCost(index) - get(res)['fame'][0];
        // in seconds vv
        let timeRemain = Math.round(remain / (5*get(resDeltas)['fame']));
        let timeText = (get(resDeltas)['fame'] != 0 ? formatToTime(timeRemain) : 'inf');
        return decround(calcCost(index), 3) + " (" + timeText + ")"
      }
      return decround(calcCost(index), 3)
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