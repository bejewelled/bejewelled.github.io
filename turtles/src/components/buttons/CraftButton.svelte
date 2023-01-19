<div class=' grid grid-cols-1 '>
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
     on:mouseover={() => getCostText(id,amt)} 
     on:click={() => buy(id)}
     class='has-tooltip text-center text-small col-span-1 gameText py-1 items-center text-center border-solid ml-1 mr-1
     {affordStyle} 
     select-none'> <span class='{textStyle}'>+{decround(amt)}</span>
          <span class='w-[110px] tooltip shadow-lg p-1 border-white border bg-[#222529] mr-3 mt-5'>
              <div class='grid grid-flow-dense grid-rows items-baseline'>
              {#each costText as line}
              <div class="row">
                <div class='grid items-start grid-cols-5 text-small'>
                <div class="col-span-1 items-start text-left
                {line.type}">{line.val}</div>
                 <div class="col-span-4 text-right pr-1
                 items-baseline {line.type}">{line.text}</div>
              </div>
            </div>
              {/each}              
          </span>
    </div>
       
</div>




<script>
// @ts-nocheck

  import { res, policyBonuses, craftCosts, craftRes} from '../../data/player.js';
  import { builds, allGens, allBonuses, buildCounts, allSubtracts, resDeltas } from '../../data/buildings.js';
  import  fm  from '../../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'
  import {jobs} from '../../data/jobs.js'

	export let text;
  export let id;
  export let amt;
  let costText = [];
  let textStyle;
  let affordStyle;
  const updateInterval = 700 + Math.random() * 200

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
    id = id.toLowerCase();
    getAffordStyle(id, amt);   
    affordStyleInterval = setInterval(() => {
      getAffordStyle(id, amt);
    }, updateInterval);
  })

  onDestroy(() => {
    clearInterval(affordStyleInterval)
  })


  function buy(cid, amt=1) { 
    let takes = {}   
    for (let [type, val] of Object.entries($craftCosts[cid])) {
      let req = val*amt;
      if (get(res)[type][0] < req) {
        return;
      }
      else {
        takes[type] = req;
      }
    }
    res.subMany(takes);
    console.log(cid);
    craftRes.craftAdd(cid, amt);
    console.log($craftRes[cid])
    // init new jobs if the first statue is purchased
    getAffordStyle(cid);
  }

  /**
	 * @param {{ id: any; }} bid
	 * @param {number} amt
	 */

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

  function getAffordStyle(bid,amt) {
    let canAfford = true;
    for (let [type, val] of Object.entries(get(craftCosts)[bid])) {
      let req = val*amt;
      if (get(res)[type][1] < req && get(res)[type][1] > 0) {
        affordStyle = 'game-btn-nostorage';
        textStyle = 'text-nostorage'
        return;
      } else if (get(res)[type][0] < req) {
        affordStyle = "game-btn-noafford";
        textStyle = 'text-noafford'
        canAfford = false;
        return;
      }
    }
    if (canAfford) {
      affordStyle =  "game-btn";   
      textStyle = 'text-white';
    }
  }



  function getCostText(bid,amt) {
    let list = []
    for (let [type, val] of Object.entries(get(craftCosts)[bid])) {
      let req = val;
      let have = get(res)[type][0];
      let txt = decround(req*amt, 3)
      if (req > get(res)[type][1] && get(res)[type][1] > 0) {
        txt = txt + "*"
        list.push({
          type: 'text-nostorage',
          val: type,
          text: txt
        });
        continue;
      }
      if (get(res)[type][0] < req) {
        list.push({
          type: 'text-noafford',
          val: type,
          text: txt
        });
      } else {
        list.push({
          type: 'text-white',
          val: type,
          text: txt
        });
      }
    }
    costText = list;
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