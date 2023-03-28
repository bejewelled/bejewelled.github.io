<div 
     on:click={() => buy(index)}
     class='has-tooltip gameText py-1 items-center text-center border-solid ml-1 mr-1
     {affordStyle} col-span-12
     select-none'>{text} [{$stardustTab['basicUpgrades'][parseInt(index)]}]
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
  import {stardustBasics} from '../../data/stardust.js'
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
    const i = $stardustBasics[index];
    return fm.geomSum(i['base'], i['ratio'], $stardustTab['basicUpgrades'][index]);
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
      'border-2 border-red-400 text-red-400',
      'border-2 border-orange-400 text-orange-400',
      'border-2 border-amber-400 text-amber-400',
      'border-2 border-green-400 text-green-400',
      'border-2 border-emerald-300 text-emerald-300',
      'border-2 border-cyan-300 text-cyan-300',
      'border-2 border-blue-300 text-blue-300'
    ]
    return styles[Math.floor(index/3)];
  }

  function getButtonNoAffordStyle(index) {
    const styles = [
      'border-[1px] border-red-900 text-red-900 ',
      'border-[1px] border-orange-900 text-orange-900',
      'border-[1px] border-yellow-800 text-yellow-800',
      'border-[1px] border-green-800 text-green-800',
      'border-[1px] border-cyan-800 text-cyan-800',
      'border-2 border-cyan-300 text-cyan-300',
      'border-2 border-blue-300 text-blue-300'
    ]
    return styles[Math.floor(index/3)];
  }


  function setText(index) {
  	const names = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
    return names[index];
    
  }

  function setHeaderText(index) {
    switch(parseInt(index)) {
      case 0:
        return 'Increases resource production.'
      case 1:
        return 'Increases glory earned from jobs.'
      case 2:
        return 'Increases karma gained when converting.'
      case 3:
        return 'Increases favor cap.'
      case 4:
        return 'Increases the stardust time bonus for longer runs.'
      case 5:
        return 'Increases crafting yield.'
      case 6:
        return 'Increases base stardust gain on ascension.'
      default:
        return 'd';
    }
  }


  function setBonusText(index) {
    let text;
    const lv = $stardustTab['basicUpgrades'][index];
    switch (parseInt(index)) {
      case 2:
        text = 'Current: +' + decround(($stardustBasics[index]['formula'](lv)-1) * 100, 3) + "% per OOM"
        return text;
      case 3:
        text = 'Current: +' + decround(5*lv, 0);
        return text;
      case 4:
        text = 'Current: Hours since reset ^ ' + decround($stardustBasics[index]['formula'](lv), 3)
        return text;
      case 6:
        text = 'Current: +' + decround(($stardustBasics[index]['formula'](lv)), 3)
        return text;
      default:
        text = 'Current: +' + decround(($stardustBasics[index]['formula'](lv)-1) * 100, 3) + "%"
        return text;
    }
  }
  function setNextBonusText(index) {
    let text;
    const lv = $stardustTab['basicUpgrades'][index];
    switch (parseInt(index)) {
      case 2:
        text = 'Next: +' + decround(($stardustBasics[index]['formula'](lv+1)-1) * 100, 3) + "% per OOM"
        return text;
      case 3:
        text = 'Next: +' + decround(5*(lv+1), 0);
        return text;
      case 4:
        text = 'Next: Hours since reset ^ ' + decround($stardustBasics[index]['formula'](lv+1), 3)
        return text;
      case 6:
        text = 'Current: +' + decround(($stardustBasics[index]['formula'](lv+1)), 3)
        return text;
      default:
        text = 'Next: +' + decround(($stardustBasics[index]['formula'](lv+1)-1) * 100, 3) + "%"
        return text;
    }
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