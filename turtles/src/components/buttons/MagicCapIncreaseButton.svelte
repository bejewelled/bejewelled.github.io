
<div on:click = {() => buy()}
class='has-tooltip 
  {$res['power'][0] > cost ? 'game-btn' : 'game-btn-noafford'  } mainText p-1 items-center text-center select-none'>
  Increase Magic Cap by 10
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

<script>
	export let text;
  let titleText = 'Spread Fame';
  let headerText = 'Use your success from previous turtle-tastic generations to help the next ones. Your turtles will gain a very small amount of glory, which can be improved later.';
  let tooltipText = '';
  const updateInterval = Math.random() * 200 + 400;

  $: cost = (10000 * Math.pow(1.10, $magicTab['magicCapUpgrades']));


  let affordStyle, costText, textAffordStyle, affordStyleInterval;
  import { res, totalRes, gloryBonuses, magicTab, flags } from '../../data/player.js';
  import { science } from '../../data/science.js';
  import {builds, buildCounts} from '../../data/buildings.js';
  import  fm  from '../../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'
  import {allGens} from '../../data/buildings.js'

  const decround = (n, places=3) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
  };

  onMount(() => { 
    affordStyle = getAffordStyle();   
    affordStyleInterval = setInterval(() => {
      affordStyle = getAffordStyle();
      textAffordStyle = getTextAffordStyle();
      costText = getCostText();
    }, updateInterval);
  })

  function buy() {
    if ($res['power'][0] >= cost) {
      $magicTab['magicCapUpgrades']++;
      res.sub('power', cost);
      $flags['updateCapFlag']++;
      affordStyle = getAffordStyle();
      textAffordStyle = getTextAffordStyle();
    }
    // note: update the 1,000 if the ratio is changed over time
    //res.add('karma', bankAmt * 1);
    //totalRes.add('karma', bankAmt * 1);
  }
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

  function getAffordStyle() {
    if (get(res)['power'][0] < cost) {
      return "game-btn-noafford cursor-no-drop";
    } else {
      return "game-btn";
    } 
  }

  function getTextAffordStyle() {
    if (get(res)['power'][0] < cost) {
      return "text-noafford";
    } else {
      return "text-white";
    } 
  }

   function getCostText() {
      if (get(res)['power'][0] < cost) {
        let remain = cost - get(res)['power'][0];
        // in seconds vv
        let timeRemain = Math.round(remain / (5*fm.calcSigilPowerGain($magicTab['sigils'])));
        let timeText = (fm.calcSigilPowerGain($magicTab['sigils']) >= 0 ? formatToTime(timeRemain) : 'inf');
        return decround(cost, 3) + " (" + timeText + ")"
      }
      return decround(cost, 3)
  }
  



</script>

<style>
 :global(.game-btn-nostorage) {
    border: 1px solid #5e2c29;
    color: #5e2c29;
    cursor: pointer;
  }
 .game-btn-noafford {
    border: 1px solid #696969;
    color: #696969;
    cursor: pointer;
  }
  div span .game-btn-noafford {
    border: 1px solid #c9c9c9;
    color: #c9c9c9;
    cursor: pointer;
  }
  .game-btn {
    border: 1px solid #c9c9c9;
    color: #c9c9c9;
    cursor: pointer;
  }
  .game-btn:hover {
    color: white;
    border: 1px solid white;
  }
  .text-small-gray {
    font-size: 9px;
    color: gray;
  }
  .text-small-white {
    font-size: 9px;
    color: white;
  }
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }
</style>