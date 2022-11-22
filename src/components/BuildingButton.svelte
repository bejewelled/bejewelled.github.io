<div class=' grid grid-cols-8 '>
<div 
     on:mouseover={() => getCostText({id})} 
     on:mouseover={() => getHeaderText({id})}
     on:mouseover={() => getTitleText({id})} 
     on:mouseover={() => getProducerText({id})} 
     on:mouseover={() => createUpdateInterval({id})} 
     on:mouseout={() => destroyUpdateInterval({id})} 
     on:click={() => buy({id})}
     class='has-tooltip gameText py-1 items-center text-center border-solid ml-1 mr-1
     {affordStyle} {toggleableBuild ? 'border-l-green-500 col-span-6' : 'col-span-8'}
     select-none'>{text}
              <span class='w-[215px] tooltip shadow-lg p-1 border-white border bg-[#222529] ml-16'>
              <div class='text-white-500 mainText text-center'>{titleText}</div>
              <div class='title text-small-gray items-start text-center'>{headerText}</div>
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>
              <div class='grid grid-flow-dense grid-rows items-baseline'>
              {#each tooltipText as line}
              <div class="row">
                <div class='grid items-start grid-cols-5'>
                <div class="col-span-1 items-start text-left
                {line['type']==='noAfford' ? 'text-red-500' : 'text-white-500'}">{line.val}</div>
                 <div class="col-span-4 text-right pr-1
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
        {#if toggleableBuild}
        
         <div 
           on:mouseover={() => getCostText({id})} 
           on:mouseover={() => getHeaderText({id})}
           on:mouseover={() => getTitleText({id})} 
           on:mouseover={() => getProducerText({id})} 
           on:mouseover={() => createUpdateInterval({id})} 
           on:mouseout={() => destroyUpdateInterval({id})} 
           on:click={() => changeToggleAmt({id}, 1)}
           class='has-tooltip mainText col-span-1 items-center text-center border-solid ml-1 p-1 mr-1
           {toggleAffordStyle} select-none'>+
           <span class='w-[45px] tooltip shadow-lg p-1 border-white border bg-[#222529]'>
              <div 
              on:click={() => changeToggleAmt({id}, +5)}
              class='text-med-gray game-btn'>+5</div>
              <div 
              on:click={() => changeToggleAmt({id}, $buildCounts[id])}
              class='title text-med-gray game-btn items-start text-center'>+all</div>
          </span>
         </div>

         <div 
           on:mouseover={() => getCostText({id})} 
           on:mouseover={() => getHeaderText({id})}
           on:mouseover={() => getTitleText({id})} 
           on:mouseover={() => getProducerText({id})} 
           on:mouseover={() => createUpdateInterval({id})} 
           on:mouseout={() => destroyUpdateInterval({id})} 
           on:click={() => changeToggleAmt({id}, -1)}
           class='has-tooltip mainText col-span-1 items-center text-center border-solid ml-1 p-1 mr-1
           {toggleAffordStyle} select-none'>-
           <span class='w-[45px] tooltip shadow-lg p-1 border-white border bg-[#222529]'>
              <div 
              on:click={() => changeToggleAmt({id}, -5)}
              class='text-med-gray game-btn'>-5</div>
              <div 
              on:click={() => changeToggleAmt({id}, -1*$buildCounts[id])}
              class='title text-med-gray game-btn items-start text-center'>-all</div>
          </span>
         </div>


        {/if}
    </div>




<script>
  import { res } from '../data/player.js';
  import { builds, allGens, allBonuses, buildCounts } from '../data/buildings.js';
  import  fm  from '../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'

	export let text;
  export let id;
  let titleText = '';
  let headerText = '';
  let tooltipText = [];
  let producerText = [];
  let affordStyle;
  let toggleAffordStyle;
  let toggleableBuild = get(builds)[id]['toggleable'];

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
    getAffordStyle(id);   
    affordStyleInterval = setInterval(() => {
      getAffordStyle(id);
      getToggleAffordStyle(id);
    }, 600);
  })

  onDestroy(() => {
    clearInterval(checkResUnlockInterval)
    clearInterval(affordStyleInterval)
  })
  // these methods allow tooltips to auto-update each second
  function createUpdateInterval(bid) {
    tooltipUpdateInterval = setInterval(() => {
      getCostText(bid);
      getProducerText(bid);
    }, 200);
  }

  function destroyUpdateInterval(bid) {
    clearInterval(tooltipUpdateInterval);
  }

  function buy(bid) { 
    let takes = {}   
    for (let [type, val] of Object.entries(get(builds)[bid.id]['costs'])) {
      let ratio = get(builds)[bid.id]['ratio']
      let count = get(buildCounts)[bid.id][0]
      let req = fm.geomSequenceSum(val,ratio,count);
      if (get(res)[type][0] < req) {
        return;
      }
      else {
        takes[type] = req;
      }
    }
    res.subMany(takes);
    buildCounts.add(bid.id, 1);
    if (typeof get(builds)[bid.id]['caps'] != undefined) {
      res.addCapMany(get(builds)[bid.id]['caps']);
    }
    getTitleText(bid);
    getCostText(bid);
    getProducerText(bid);
    getAffordStyle(bid.id);
    allGens.updateAll();
    allBonuses.updateAll();
  }

  function changeToggleAmt(bid, amt) {
    if (amt >= 0) {
      buildCounts.changeToggle(bid.id, amt);
    } else {
      buildCounts.changeToggle(bid.id, amt);
    }
  }

  function getTitleText(bid) {
    titleText = get(builds)[bid.id]['name'] + " (" + get(buildCounts)[bid.id][0] + ") "
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

  function getAffordStyle(bid) {
    let canAfford = true;
    for (let [type, val] of Object.entries(get(builds)[bid]['costs'])) {
      let ratio = get(builds)[bid]['ratio']
      let count = get(buildCounts)[bid][0]
      let req = fm.geomSequenceSum(val,ratio, count);
      if (get(res)[type][1] < req) {
        affordStyle = 'game-btn-nostorage';
        return;
      } else if (get(res)[type][0] < req) {
        affordStyle = "game-btn-noafford";
        canAfford = false;
      }
    }
    if (canAfford) {
      affordStyle =  "game-btn";   
    }
  }

  function getToggleAffordStyle(bid) {
    for (let [type, val] of Object.entries(get(builds)[bid]['gens'])) {
      let ratio = get(builds)[bid]['ratio']
      let count = get(buildCounts)[bid][0]
      let req = val;
      if (get(res)[type][0] < req) {
        toggleAffordStyle = 'game-btn-toggleoff';
        return;
      }   
    }
    toggleAffordStyle =  "game-btn-toggleon"; 
  }

  function getCostText(bid) {
    let list = []
    for (let [type, val] of Object.entries(get(builds)[bid.id]['costs'])) {
      let ratio = get(builds)[bid.id]['ratio']
      let count = get(buildCounts)[bid.id][0]
      let req = fm.geomSequenceSum(val,ratio, count)
      let have = get(res)[type][0];
      let txt = (decround(get(res)[type][0], 3) + " / " + decround(req, 3)).toString();
      if (req > get(res)[type][1]) {
        txt = txt + "*"
      }
      if (get(res)[type][0] < req) {
        let remain = req - have;
        // in seconds vv
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
        let txt = (val > 0 ? '+' : '') + decround(val*5, 3).toString() + " / sec" 
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
    if (!(get(builds)[bid.id]['bonuses'] === undefined)) {
    for (let [type, val] of (Object.entries(get(builds)[bid.id]['bonuses']))) {
        let txt = decround(val, 3).toString() + "%"
        list.push({
          type: 'afford',
          val: type + ' bonus:',
          text: txt
        });
      }
    }
    producerText = list;
  }
// all code logic
</script>



<style>
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