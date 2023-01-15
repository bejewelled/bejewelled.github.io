
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:mouseover={() => getCostText({id})} 
     on:mouseover={() => getHeaderText({id})}
     on:mouseover={() => getTitleText({id})} 
     on:mouseover={() => createUpdateInterval({id})} 
     on:mouseout={() => destroyUpdateInterval({id})} 
     on:click={() => buy({id})}
     class='has-tooltip mainText p-1 items-center text-center 
     {affordStyle} select-none'>{titleText}
              <span class='w-[290px] tooltip shadow-lg p-1 border-white border bg-[#222529] gameTextWhite mr-6'>
              <div class='text-white-500 mainText text-center'>{titleText}</div>
              <div class='title text-small-gray items-start text-center'>{headerText}</div>
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>
              <div class='grid grid-flow-dense grid-rows items-baseline'>
              {#each tooltipText as line}
              <div class="row">
                <div class='grid items-start text-small grid-cols-4'>
                <div class="col-span-1 items-start text-left 
                {line['type']==='noAfford' ? 'text-red-500' : 'text-white-500'}">{line.val}</div>
                 <div class="col-span-3 text-right pr-1
                 items-baseline {line['type']==='noAfford' ? 'text-red-500' : 'text-white-500'}">{line.text}</div>
              </div>
            </div>
              {/each} 
              {#if bonusText.length > 0}
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>              
              {#each bonusText as line}
              <div class="row grid-rows-1 items-baseline">
                <div class='grid text-small-gray grid-cols-1'>
                 <div class="col-span-1 text-left">{line.label}{line.val}</div>
              </div>
            </div> 
              {/each}
              {/if}          
              </span>
            </div>



<script>
// @ts-nocheck

	export let text;
  export let id;
  let titleText = '';
  let headerText = '';
  let tooltipText = [];
  $: bonusText = getBonusText(id);
  $: hasStorage = checkIfStorageAvailable(id);
  let affordStyle;
  import { res } from '../../data/player.js';
  import { science } from '../../data/science.js';
  import {builds, buildCounts, resDeltas} from '../../data/buildings.js';
  import  fm  from '../../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'
  import {allGens} from '../../data/buildings.js'
  import {policy} from '../../data/policy.js'

  const decround = (n, places) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
  };



  let tooltipUpdateInterval;
  let affordStyleInterval;

  onMount(() => {
    getTitleTextNoobject(id);
    getAffordStyle(id);   
    affordStyleInterval = setInterval(() => {
      getAffordStyle(id);
    }, 200);
  })

  onDestroy(() => {
    clearInterval(affordStyleInterval);
  })
  // these methods allow tooltips to auto-update each second
  function createUpdateInterval(sid) {
    tooltipUpdateInterval = setInterval(() => {
      getCostText(sid);
    }, 200);
  }

  function destroyUpdateInterval(sid) {
    clearInterval(tooltipUpdateInterval);
  }

  function buy(sid) { 

    if (get(science)[sid.id]['researched']) {
      return;
    }
    let takes = {}   
    for (let [type, val] of Object.entries(get(science)[sid.id]['costs'])) {
      let req = val;
      if (get(res)[type][0] < req) {
        return;
      }
      else {
        takes[type] = req;
      }
    }
    res.subMany(takes);
    science.unlock(sid.id);
    science.checkCriteria();
    // handle special cases here
    getTitleText(sid);
    getAffordStyle(sid.id);
    getCostText(sid);
    policy.checkCriteria();
  }

  function checkIfStorageAvailable(sid) {
  }

  function getAffordStyle(bid) {
    let canAfford = true;
    for (let [type, val] of Object.entries(get(science)[bid]['costs'])) {
      let req = val;
      if (get(res)[type][1] < req && get(res)[type][1] > 0) {
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

  function getTitleTextNoobject(sid) {
    titleText = get(science)[id]['name'];
    if (get(science)[id]['researched'] == true) {
          titleText += ' (researched)'
    }
  }

  function getTitleText(sid) {
    titleText = get(science)[sid.id]['name'];
    if (get(science)[sid.id]['researched'] == true) {
          titleText += ' (researched)'
    }
  }

  function getHeaderText(sid) {
    headerText = get(science)[sid.id]['description']
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

  function getCostText(sid) {
    let list = []
    for (let [type, val] of Object.entries(get(science)[sid.id]['costs'])) {
      let req = val;
      let have = get(res)[type][0];
      let txt = (decround(get(res)[type][0], 3) + " / " + decround(req, 3)).toString();
      if (req > get(res)[type][1] && get(res)[type][1] > 0) {
        txt = txt + "*"

      }
      if (get(res)[type][0] < req) {
        let remain = req - have;
        // in seconds vv
        let timeRemain = Math.round(remain / (5*get(resDeltas)[type]));
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


  function getBonusText(sid) {
    if (!(get(science)[sid]['bonuses'] === undefined)) {
      return get(science)[sid]['bonuses'];
    }
    return [];
  }

</script>

<style>
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }
</style>