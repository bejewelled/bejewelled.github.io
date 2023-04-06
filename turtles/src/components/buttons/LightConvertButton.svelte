
<div on:click = {() => convert()}
class='has-tooltip 
  {$res['karma'][0] >= 25000000 ? 'game-btn' : 'game-btn-noafford'  } mainText p-1 items-center text-center select-none'>
  Convert 25M Banked Karma into Light      
   
</div>


<script>
	export let text;
  export let id;
  let titleText = 'Spread Fame';
  let headerText = 'Use your success from previous turtle-tastic generations to help the next ones. Your turtles will gain a very small amount of glory, which can be improved later.';
  let tooltipText = '';
  $: gloryBuffs = Object.entries(get(gloryBonuses));
  let affordStyle;
  import { res, totalRes, gloryBonuses, religionTab } from '../../data/player.js';
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

  function calcCost() {

  }

  function convert() {
    let banked = $religionTab['karmaBanked'];
    if (banked >= 25000000) {
      res.add('light', 1);
      religionTab.sub('karmaBanked', 25000000);
    }
    // note: update the 1,000 if the ratio is changed over time
    //res.add('karma', bankAmt * 1);
    //totalRes.add('karma', bankAmt * 1);
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