<div class=' grid grid-cols-1 '>
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
     on:mouseover={() => getCostText(id)} 
     on:click={() => buy(id)}
     class='has-tooltip h-[22px] text-center align-middle text-small col-span-1 gameText items-center border-solid 
     {affordStyle} 
     select-none'> <span class='{textStyle}'>+{decround(amt,  2)}</span>
          <span class='tooltip px-1 py-0.5 shadow-lg border-white border bg-[#222529] mr-3 mt-5 pointer-events-none'>
              <div class='grid grid-flow-dense grid-rows items-baseline'>
              <div class="row">
                <div class='grid items-start grid-cols-5 text-small'>
                <div class="col-span-2 items-start text-left
                {textAffordStyle}">power</div>
                 <div class="col-span-3 text-right pr-1
                 items-baseline {textAffordStyle}">{costText}</div>
              </div>
            </div>              
          </span>
    </div>
       
</div>



<script>
// @ts-nocheck

  import { res, policyBonuses, craftCosts, craftRes, stardustTab, magicTab} from '../../data/player.js';
  import { builds, allGens, allBonuses, buildCounts, allSubtracts, resDeltas } from '../../data/buildings.js';
  import  fm  from '../../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'
  import {jobs} from '../../data/jobs.js'
  import {stardustBasics} from '../../data/stardust.js'

	export let text;
  export let id;
  export let amt;
  $: craftBonus = () => {
    return ($stardustBasics[5]['formula']($stardustTab['basicUpgrades'][5]) +
    $buildCounts['factory'][0]*0.1)
  }
  $: cost = fm.getPowerCraftCost(id, $craftRes[id][3])*amt;
  let costText = [];
  let textStyle;
  let affordStyle, textAffordStyle;
  const updateInterval = 700 + Math.random() * 200

  const decround = (n, places) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
  };

  let tooltipUpdateInterval;
  let checkResUnlockInterval;
  let affordStyleInterval;

  onMount(() => { 
    amt = parseInt(amt);
    id = id.toLowerCase();
    affordStyle = getAffordStyle(id, amt);   
    affordStyleInterval = setInterval(() => {
      affordStyle = getAffordStyle(id,amt);
      textAffordStyle = getTextAffordStyle(id, amt);
      costText = getCostText(id, amt);
    }, updateInterval);
  })

  onDestroy(() => {
    clearInterval(affordStyleInterval)
  })


  function buy(cid) {  
    if ($res['power'][0] >= cost) {
      res.sub('power', cost);
      craftRes.craftAdd(cid, amt);
      // init new jobs if the first statue is purchased
      affordStyle = getAffordStyle(cid, amt);
    }
  }
  

  /**
	 * @param {{ id: any; }} bid
	 * @param {number} amt
	 */

  function formatToTime(t) {
    let text = '';
    if (t < 0) {
      return 'inf';
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

  function getAffordStyle(cid, amt) {
    if (get(res)['power'][0] < cost) {
      return "game-btn-noafford cursor-no-drop";
    } else {
      return "game-btn";
    } 
  }

  function getTextAffordStyle(cid, amt) {
    if (get(res)['power'][0] < cost) {
      return "text-noafford";
    } else {
      return "text-white";
    } 
  }

   function getCostText(index, amt) {
      if (get(res)['power'][0] < cost) {
        let remain = cost - get(res)['power'][0];
        // in seconds vv
        let timeRemain = Math.round(remain / (5*fm.calcSigilPowerGain($magicTab['sigils'])));
        let timeText = (get(resDeltas)['fame'] != 0 ? formatToTime(timeRemain) : 'inf');
        return decround(cost, 3) + " (" + timeText + ")"
      }
      return decround(cost, 3)
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