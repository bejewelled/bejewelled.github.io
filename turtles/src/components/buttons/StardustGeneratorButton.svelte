<div 
     on:click={() => buy(index)}
     class='has-tooltip gameText py-1 items-center text-center border-solid ml-1 mr-1
     {affordStyle} col-span-12
     select-none'>{text} [{$stardustTab['generators'][parseInt(index)]}]
              <span class='w-[290px] tooltip shadow-lg p-1 border-white border bg-[#222529] ml-16 pointer-events-none'>
              <div class='title text-small-gray items-start text-center'>{headerText}</div>
              <div class='py-1 text-white-500 mainText'><hr/></div>

              <div class="pb-2 row">
                <div class='grid items-start grid-cols-5 text-small'>
                <div class="col-span-1 items-start text-left
                {costAffordStyle==='noAfford' ? 'text-med-gray' : 'text-white-500'}">stardust</div>
                 <div class="col-span-4 text-right pr-1
                 items-baseline {costAffordStyle==='noAfford' ? 'text-med-gray' : 'text-white-500'}">{costText}</div>
              </div>
            </div>
              <div class='text-small-gray'>{bonusText}</div>
              <div class='text-small-gray'>{nextBonusText}</div>
              </span>
      </div>

<script>
// @ts-nocheck

  import { res, fameTab, stardustTab } from '../../data/player.js';
  import { builds, allGens, allBonuses, buildCounts, allSubtracts, resDeltas } from '../../data/buildings.js';
  import {jobs} from '../../data/jobs.js'
  import {stardustBasics, stardustGenerators} from '../../data/stardust.js'
  import  fm  from '../../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'

  let text, costText;
  export let index;
  $: headerText = setHeaderText(index);
  $: bonusText = setBonusText(index);
  $: nextBonusText = setNextBonusText(index);
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
	   affordStyle = setAffordStyle(index);
	   text = setText(index); 
     bonusText = setBonusText(index);
     nextBonusText = setNextBonusText(index);

  	cooldownStyleInterval = setInterval(() => {
  		affordStyle = setAffordStyle(index);
      costText = setCostText(index);
      costAffordStyle = setCostAffordStyle(index);
  	}, 500)
  })

  onDestroy(() => {
  	clearInterval(cooldownStyleInterval);
  })


  function buy(index) {
    //if (index == 1 && get(fameTab)['jobUpgrades'][1] > 7) return; // max level of 7
    console.log(index)
    if (get(res)['stardust'][0] >= calcCost(index)) {
      res.sub('stardust', calcCost(index)); // subtract fame
      $stardustTab['basicUpgrades'][index]++;
      console.log($stardustTab['basicUpgrades']);
      // add a new job slot
      costText = setCostText(index);
      costAffordStyle = setCostAffordStyle(index);
      bonusText = setBonusText(index);
      nextBonusText = setNextBonusText(index);

      if (index == 3) {
        $res['favor'][1] += 5;
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
    const i = $stardustGenerators[index];
    return fm.geomSum(i['base'], i['ratio'], $stardustTab['generators'][index]);
  }

  function setAffordStyle(index) {
    if (get(res)['stardust'][0] < calcCost(index)) {
      return getButtonNoAffordStyle(index);
    } else {
  		return getButtonStyle(index);
    }	
  }

  function setCostAffordStyle(index) {
    if (get(res)['stardust'][0] < calcCost(index)) { 
      return "noAfford";
    } else {
      return "text-white";
    } 
  }

  function getButtonStyle(index) {
    const styles = [
      'border-4 border-double border-red-200 text-red-200',
      'border-4 border-double border-orange-200 text-orange-200',
      'border-4 border-double border-amber-200 text-amber-200',
      'border-4 border-double border-green-200 text-green-200',
      'border-4 border-emerald-300 text-emerald-300',
      'border-4 border-cyan-300 text-cyan-300',
      'border-4 border-blue-300 text-blue-300'
    ]
    return styles[index];
  }

  function getButtonNoAffordStyle(index) {
    const styles = [
      'border-[1px] border-double border-red-600 text-red-800',
      'border-[1px] border-double border-orange-600 text-orange-800',
      'border-[1px] border-double border-yellow-600 text-yellow-800',
      'border-[1px] border-double border-green-600 text-green-800',
      'border-[1px] border-cyan-800 text-cyan-800',
      'border-2 border-cyan-300 text-cyan-300',
      'border-2 border-blue-300 text-blue-300'
    ]
    return styles[index];
  }


  function setText(index) {
  	const names = ['Andromeda', 'Cassiopeia', 'Helios', 'Magellanus']
    return names[index];
    
  }

  function setHeaderText(index) {
    return "Generates galaxy upgrades from tier " + (parseInt(index)+1).toString() + ".";
  }


  function setBonusText(index) {
    let text;
    const lv = $stardustTab['generators'][index];
    text = 'Current: +' + decround(($stardustGenerators[index]['formula'](lv)), 3) + " / sec"
    return text;
  }

  function setNextBonusText(index) {
    let text;
    const lv = $stardustTab['generators'][index];
    text = 'Next: +' + decround(($stardustGenerators[index]['formula'](lv+1)), 3) + " / sec"
    return text;
  }

  

  function setCostText(index) {
      // if (index == 1 && get(fameTab)['jobUpgrades'][1]['level'] > 7) return 'This upgrade is at max level.'
      return decround(calcCost(index), 3);
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