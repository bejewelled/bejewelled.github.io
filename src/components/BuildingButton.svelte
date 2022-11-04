
<div on:mouseover={() => getProducerText({id})} 
     on:mouseover={() => getCostText({id})} 
     on:mouseover={() => getHeaderText({id})}
     on:mouseover={() => getTitleText({id})} 
     on:click={() => buy({id})}
     class='has-tooltip mainText p-1 items-center text-center game-btn select-none'>{text}
              <span class='w-[175px] tooltip shadow-lg p-1 border-white border bg-[#222529] mr-6'>
              <div class='text-white-500 mainText text-center'>{titleText}</div>
              <div class='title text-small-gray items-start text-center'>{headerText}</div>
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>
              <div class='grid grid-flow-dense grid-rows items-baseline'>
              {#each tooltipText as line}
              <div class="row">
                <div class='grid items-start grid-cols-3'>
                <div class="col-span-1 items-start text-left
                {line['type']==='noAfford' ? 'text-red-500' : 'text-white-500'}">{line.val}</div>
                 <div class="col-span-2 text-left
                 items-baseline {line['type']==='noAfford' ? 'text-red-500' : 'text-white-500'}">{line.text}</div>
              </div>
            </div>
              {/each}
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>              
              {#each producerText as line}
              <div class="row grid-rows-1 items-baseline">
                <div class='grid text-small-gray grid-cols-3'>
                 <div class="col-span-1 text-left">{line.val}</div>
                 <div class="col-span-2 text-left">{line.text}</div>
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
  let producerText = [];
  import { res } from '../data/player.js';
  import { builds, allGens } from '../data/buildings.js';
  import  fm  from '../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount} from 'svelte'

  let decround  = ((i, places) => {
    let s = ''; // shortener
    // if (i > 9750) {
    //   i /= 1000;
    //   s = 'K';
    // }
    return (Math.round(i*Math.pow(10,places))/Math.pow(10,places)).toLocaleString();// + s
  })


  function buy(bid) { 
    let takes = {}   
    for (let [type, val] of Object.entries(get(builds)[bid.id]['costs'])) {
      let ratio = get(builds)[bid.id]['ratio']
      let count = get(builds)[bid.id]['count']
      let req = fm.geomSequenceSum(val,ratio,count);
      if (get(res)[type][0] < req) {
        return;
      }
      else {
        takes[type] = req;
      }
    }
    res.subMany(takes);
    builds.add(bid.id, 1);
    if (typeof get(builds)[bid.id]['caps'] != undefined) {
      res.addCapMany(get(builds)[bid.id]['caps']);
    }
    getTitleText(bid);
    getCostText(bid);
    getProducerText(bid);
    allGens.updateAll();
  }

  function getTitleText(bid) {
    titleText = get(builds)[bid.id]['name'] + " (" + get(builds)[bid.id]['count'] + ") "
  }

  function getHeaderText(bid) {
    headerText = get(builds)[bid.id]['description']
  }

  function formatToTime(t) {
    let text = '';
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

  function getCostText(bid) {
    let list = []
    for (let [type, val] of Object.entries(get(builds)[bid.id]['costs'])) {
      let ratio = get(builds)[bid.id]['ratio']
      let count = get(builds)[bid.id]['count']
      let req = fm.geomSequenceSum(val,ratio, count)
      let have = get(res)[type][0];
      let txt = (decround(get(res)[type][0], 3) + " / " + decround(req, 3)).toString();
      if (req > get(res)[type][1]) {
        txt = txt + "*"
      }
      if (get(res)[type][0] < req) {
        let remain = req - have;
        let timeRemain = Math.round(remain / (5*get(allGens)[type]));
        let timeText = (get(allGens)[type] != 0 ? formatToTime(timeRemain) : 'inf');
        txt += " (" + timeText + ")"
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
  }

  function getProducerText(bid) {
    let list = []
    for (let [type, val] of Object.entries(get(builds)[bid.id]['gens'])) {
        let txt = (val > 0 ? '+' : '-') + decround(val*5, 3).toString() + " / sec" 
        list.push({
          type: 'afford',
          val: type,
          text: txt
        });
    }
    if (typeof get(builds)[bid.id]['caps'] != undefined) {
    for (let [type, val] of (Object.entries(get(builds)[bid.id]['caps']))) {
        let txt = decround(val, 3).toString()
        list.push({
          type: 'afford',
          val: type + ' cap:',
          text: txt
        });
      }
    }
    producerText = list;
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
    font-size: 9px;
    color: gray;
  }
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }
</style>