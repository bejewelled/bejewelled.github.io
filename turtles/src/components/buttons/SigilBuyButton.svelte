<div class='grid grid-cols-5'>
<div 
     on:click={() => buy(index, 1)}
     class='col-span-3 has-tooltip gameText py-1 items-center text-center border-solid ml-1 mr-1
     {affordStyle}
     select-none'>Buy a Sigil [{$magicTab['sigilsBought']}]
          <span class='w-[290px] pr-1 pointer-events-none tooltip shadow-lg p-1 border-white border bg-[#222529]'>
              <div class='title text-small-gray items-start text-center'>Buy a sigil, with a chance to gain increasingly rarer ones as more are purchased.</div>
              <div class='text-white-500 mainText'><hr/></div>
              <div class="row">
                <div class='grid items-start grid-cols-5 text-small'>
                <div class="col-span-1 items-start text-left
                {costAffordStyle==='noAfford' ? 'text-red-500' : 'text-white-500'}">magic</div>
                 <div class="col-span-4 text-right pr-1
                 items-baseline {costAffordStyle==='noAfford' ? 'text-red-500' : 'text-white-500'}">{costText}</div>
              </div>
            </div>
              </span>
  </div>
  <div 
     on:click={() => buy(index, 10)}
     class='col-span-1 pr-1 has-tooltip gameText py-1 items-center text-center border-solid ml-1 mr-1
     {setAffordStyle(10)}
     select-none'>x10
          <span class='w-[290px] tooltip pointer-events-none shadow-lg p-1 border-white border bg-[#222529] ml-16'>
              <div class='title text-small-gray items-start text-center'>Buy a sigil, with a chance to gain increasingly rarer ones as more are purchased.</div>
              <div class='text-white-500 mainText'><hr/></div>
              <div class="row">
                <div class='grid items-start grid-cols-5 text-small'>
                <div class="col-span-1 items-start text-left
                {costAffordStyle==='noAfford' ? 'text-red-500' : 'text-white-500'}">magic</div>
                 <div class="col-span-4 text-right pr-1
                 items-baseline {setCostAffordStyle(10)==='noAfford' ? 'text-red-500' : 'text-white-500'}">{costText10}</div>
              </div>
            </div>
          </span>
  </div>
  <div 
     on:click={() => buy(index, 100)}
     class='col-span-1 has-tooltip gameText pr-1 py-1 items-center text-center border-solid ml-1 mr-1
     {setAffordStyle(100)}
     select-none'>x100
          <span class='w-[290px] tooltip pointer-events-none shadow-lg p-1 border-white border bg-[#222529] ml-16'>
              <div class='title text-small-gray items-start text-center'>Buy a sigil, with a chance to gain increasingly rarer ones as more are purchased.</div>
              <div class='text-white-500 mainText'><hr/></div>
              <div class="row">
                <div class='grid items-start grid-cols-5 text-small'>
                <div class="col-span-1 items-start text-left
                {setCostAffordStyle(100)==='noAfford' ? 'text-red-500' : 'text-white-500'}">magic</div>
                 <div class="col-span-4 text-right pr-1
                 items-baseline {setCostAffordStyle(100)==='noAfford' ? 'text-[#696969]' : 'text-white-500'}">{costText100}</div>
              </div>
            </div>
              </span>
  </div>
</div>
<div class='gameTextWhite' on:click={() => reset()}>
     reset magic
      </div>

<script>
// @ts-nocheck

  import { res, magicTab } from '../../data/player.js';
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
  let styleInterval;

  $: costText100 = setCostText(100)
  $: costText10 = setCostText(10)
  $: costText = setCostText(1)

  const decround = (n, places=3) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
  };

  let cooldownStyleInterval;

  onMount(() => { 
	   affordStyle = setAffordStyle(index);
  	cooldownStyleInterval = setInterval(() => {
  		affordStyle = setAffordStyle(index); 
      costAffordStyle = setCostAffordStyle(index);
  	}, 500)
  })

  onDestroy(() => {
  	clearInterval(cooldownStyleInterval);
  })


  function buy(i, n) {
    const cost = (n > 1 ? calcSumCost(n) : calcCost())
    if (get(res)['magic'][0] >= cost) {
      res.sub('magic', cost); // subtract magic
      let next;
      for (let i = 0; i < n; i++) {
       next = fm.getNextSigil(fm.getSigilProbTable($magicTab['sigilsBought'])); // roll next sigil
       console.log(next);
       $magicTab['sigils'][next]++;
       $magicTab['sigilsBought']++;
      }
      const writeback = setTimeout(() => {
        costText = setCostText(1);
        costText10 = setCostText(10);
        costText100 = setCostText(100);
      }, 225)
      affordStyle = setAffordStyle(index);
      costAffordStyle = setCostAffordStyle(index);
    }
  }

  function reset() {
    $magicTab['sigils'] = [0,0,0,0,0,0,0]
    $magicTab['sigilsBought'] = 0;
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

  function calcCost() {
    return 10 * (Math.pow(1.01, $magicTab['sigilsBought']));
  }

  function calcSumCost(n) {
    return fm.finiteGeomSum(calcCost(), 1.01, n);
  }

  function setAffordStyle(n) {
    const cost = (n > 1 ? calcSumCost(n) : calcCost())
    if (get(res)['magic'][1] < cost) {
      return "game-btn-nostorage cursor-no-drop";
    } else if (get(res)['magic'][0] < cost) {
      return "game-btn-noafford cursor-no-drop";
    } else {
  		return "game-btn";
    }	
  }

  function setCostAffordStyle(n) {
    const cost = (n > 1 ? calcSumCost(n) : calcCost())
    if (get(res)['magic'][1] < cost) { 
      return "noStorage";
    } else if (get(res)['magic'][0] < cost) { 
      return "noAfford";
    } else {
      return "";
    } 
  }


  function setCostText(n) {
      const cost = (n > 1 ? calcSumCost(n) : calcCost())
      if (get(res)['magic'][1] < cost) {
        let remain = cost - get(res)['magic'][0];
        // in seconds vv
        let timeRemain = Math.round(remain / (5*get(resDeltas)['magic']));
        let timeText = (get(resDeltas)['magic'] != 0 ? formatToTime(timeRemain) : 'inf');
        return decround(cost, 3) + "* (" + timeText + ")"
      }
      if (get(res)['magic'][0] < cost) {
        console.log('noafford')
        let remain = cost - get(res)['magic'][0];
        // in seconds vv
        let timeRemain = Math.round(remain / (5*get(resDeltas)['magic']));
        let timeText = (get(resDeltas)['magic'] != 0 ? formatToTime(timeRemain) : 'inf');
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