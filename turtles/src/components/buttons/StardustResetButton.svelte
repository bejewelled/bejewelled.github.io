
<div on:click = {() => stardustReset()}
class='has-tooltip game-btn mainText p-1 items-center text-center 
     {affordStyle} select-none'>Ascend
          </div>
              <!-- {#each tooltipText as line} -->
<!--               <div class="row">
                <div class='grid items-start grid-cols-3'>
                <div class="col-span-1 items-start text-left text-white-500 ">{line.val}</div>
                 <div class="col-span-2 text-left
                 items-baseline {line['type']==='noAfford' ? 'text-red-500' : 'text-white-500'}">{line.text}</div>
              </div>
            </div> -->
              <!-- {/each}  -->
              <!-- {#if bonusText.length > 0}
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>              
              {#each bonusText as line}
              <div class="row grid-rows-1 items-baseline">
                <div class='grid text-small-gray grid-cols-1'>
                 <div class="col-span-1 text-left">{line}</div>
              </div>
            </div> 
              {/each}
              {/if}   -->        



<script>
	export let resetFunc;
  export let id;
  let titleText = '';
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

  let decround  = ((i, places=3) => {
    let s = ''; // shortener
    // if (i > 9750) {
    //   i /= 1000;
    //   s = 'K';
    // }
    return (Math.round(i*Math.pow(10,places))/Math.pow(10,places)).toLocaleString();// + s
  })

  function stardustReset() {
    resetFunc();
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