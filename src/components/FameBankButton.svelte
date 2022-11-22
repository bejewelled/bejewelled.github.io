
<div on:click = {() => bank()}
class='has-tooltip game-btn mainText p-1 items-center text-center 
     {affordStyle} select-none'>Consume Fame
              <span class='w-[215px] tooltip shadow-lg p-1 border-white border bg-[#222529] gameTextWhite mr-6'>
              <div class='text-white-500 mainText text-center'>{titleText}</div>
              <div class='title text-small-gray items-start text-center'>{headerText}</div>
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>
              <div class='contianer text-small-white'>
              <span class=' select-none'>Bonuses from Glory </span>
              <div class='pt-2 grid'>
              {#if gloryBuffs[0][1] > 0.00003}
              {#each gloryBuffs as gl}
                {#if gl[1] > 0.00003}
                <div class='row items-baseline'>
                  <div class='grid grid-cols-4'>
                    <div class='col-span-3 text-left'>{gl[0]}</div> <div class='col-span-1 text-baseline'>{decround(gl[1], 3)}%</div>
                  </div>
                </div>
                {/if}             
              {/each}
              {:else}
                <div class='row text-small-gray'>Perhaps your civilization needs more glory to reap its rewards.</div>
              {/if}
            </div>
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
              </span>
            </div>



<script>
	export let text;
  export let id;
  let titleText = 'Spread Fame';
  let headerText = 'Use your success from previous turtle-tastic generations to help the next ones. Your turtles will gain glory, which gives increasingly powerful bonuses as more is accumulated.';
  let tooltipText = '';
  $: gloryBuffs = Object.entries(get(gloryBonuses));
  let affordStyle;
  import { res, gloryBonuses } from '../data/player.js';
  import { science } from '../data/science.js';
  import {builds, buildCounts} from '../data/buildings.js';
  import  fm  from '../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'
  import {allGens} from '../data/buildings.js'

  let decround  = ((i, places) => {
    let s = ''; // shortener
    // if (i > 9750) {
    //   i /= 1000;
    //   s = 'K';
    // }
    return (Math.round(i*Math.pow(10,places))/Math.pow(10,places)).toLocaleString();// + s
  })

  function bank() {
    let bankAmt = get(res)['fame'][0]
    res.set('fame', 0);
    res.add('glory', bankAmt);
    updateBonusesFromGlory();
  }

  function updateBonusesFromGlory() {
    gloryBonuses.set('Production Bonus', fm.calcGloryBonusProduction(get(res)['fame']));
    gloryBonuses.set('Cost Ratio Reduction', fm.calcGloryCostRatioReduction(get(res)['fame']));
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