
<div on:mouseover={() => getTooltipText({id})} 
     on:mouseover={() => getHeaderText({id})}
     on:mouseover={() => getTitleText({id})} 
     class='has-tooltip mainText p-1 items-center text-center game-btn'>{text}
              <span class='tooltip shadow-lg p-1 border-white border bg-[#222529] mr-6'>
              <div class='text-white-500 mainText'>{titleText}</div>
              <div class='title text-small-gray'>{headerText}</div>
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>
              <div class='grid grid-rows items-start'>
              {#each tooltipText as line}
              <div class="row">
                <div class='grid grid-cols-12'>
                 <div class="col-span-4 items-baseline {line['type']==='noAfford' ? 'text-red-500' : 'text-white-500'}
               {line['type']==='title'? 'txt-small-gray text-center' : 'text-white-500 text-left'}">{line.val}</div>
                 <div class="col-span-4 items-baseline {line['type']==='noAfford' ? 'text-red-500' : 'text-white-500'}
               {line['type']==='title'? 'txt-small-gray text-center' : 'text-white-500 text-left'}">{line.text}</div>
              </div>
            </div>
              {/each}
              </span>
            </div>



<script>
	export let text;
  export let id;
  let titleText = '';
  let headerText = '';
  let tooltipText = [];
  import { res } from '../data/player.js';
  import { builds } from '../data/buildings.js';
  import  fm  from '../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount} from 'svelte'

  let decround  = ((i, places) => {
    let s = ''; // shortener
    if (i > 9750) {
      i /= 1000;
      s = 'K';
    }
    return (Math.ceil(i*Math.pow(10,places))/Math.pow(10,places)).toString() + s;
  })

  function getTitleText(bid) {
    titleText = get(builds)[bid.id]['name'] + " (" + get(builds)[bid.id]['count'] + ") "
  }

  function getHeaderText(bid) {
    headerText = get(builds)[bid.id]['description']
  }

  function getTooltipText(bid) {
    let list = []
    for (let [type, val] of Object.entries(get(builds)[bid.id]['costs'])) {
      let ratio = get(builds)[bid.id]['ratio']
      let count = get(builds)[bid.id]['count']
      let req = fm.geomSequenceSum(val,ratio, count)
      let have = get(res)[type];
      let txt = (decround(get(res)[type], 3) + " / " + decround(req, 3)).toString();
      console.log(txt)
      if (get(res)[type] < req) {
        list.push({
          type: 'noAfford',
          val: type,
          text: txt
        });
      } else {
        list.push({
          type: 'afford',
          val: type,
          text: txt
        });
      }
    }
    tooltipText = list;
    console.log(tooltipText);
  }

</script>

<style>
  .game-btn {
    border: 1px solid white;
    color: #d9d9d9;
    cursor: pointer;
  }
  .game-btn:hover {
    color: white;
  }
  .text-small-gray {
    font-size: 7px;
  }
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }
</style>