<div class=' grid grid-cols-12 '>
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div 
     on:mouseover={() => getCostText({id})}
     on:mouseover={() => getCraftCostText({id})} 
     on:mouseover={() => getHeaderText({id})}
     on:mouseover={() => getTitleText({id})} 
     on:mouseover={() => getProducerText({id})} 
     on:mouseover={() => createUpdateInterval({id})} 
     on:mouseout={() => destroyUpdateInterval({id})} 
     on:click={() => buy({id})}
     class='has-tooltip gameText py-1 items-right text-center border-solid ml-1 mr-1
     {affordStyle} {toggleableBuild ? 'border-l-green-500 col-span-8' : 'col-span-12'}
     select-none'><span class='{textStyle}'>{text}</span>
              <span class='w-[285px] tooltip shadow-lg p-1 border-white border bg-[#222529] ml-16 mt-5 pointer-events-none'>
              <div class='text-white-500 {textStyle} mainText text-center'>{titleText}</div>
              <div class='title text-small-gray items-start text-center'>{headerText}</div>
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>
              <div class='grid grid-flow-dense grid-rows items-baseline'>
              {#each costText as line}
              <div class="row">
                <div class='grid items-start grid-cols-5 text-small'>
                <div class="col-span-1 items-start text-left
                {line.type}">{line.val}</div>
                 <div class="col-span-4 text-right pr-1
                 items-baseline {line.type}">
               {line.text}</div>
              </div>
            </div>
              {/each}
              {#each craftCostText as line1}
              <div class="row">
                <div class='grid items-start grid-cols-5 text-small'>
                <div class="col-span-2 items-start text-left
                {line1.type}">{line1.val}</div>
                 <div class="col-span-3 text-right pr-1
                 items-baseline {line1.type}">
               {line1.text}</div>
              </div>
            </div>
              {/each}
              <div class='spacer text-small-gray text-center pt-1 pb-1'> <hr/> </div>              
              {#each producerText as line}
              <div class="row grid-rows-1 items-baseline">
                <div class='grid text-small-gray grid-cols-4'>
                 <div class="col-span-2 text-left">{line.val}</div>
                 <div class="col-span-2 text-left">{line.text}</div>
              </div>
            </div>
              {/each}
              {#if (get(policyBonuses)[id] !== undefined)}
                <div class='row grid-rows-1 pt-1'>
                  <div class="grid text-small text-indigo-300 text-opacity-55">
                    <div class="text-center">policy bonus: +{decround((getPolicyBonusTotal(id)-1) * 100)}%</div>
                  </div>
                </div>
              {/if}


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
           class='has-tooltip mainText col-span-2 items-center text-center border-solid ml-1 p-1 mr-1
           {lockoutStyle} select-none'>+
          <!--  <span class='w-[45px] tooltip shadow-lg p-1 border-white border bg-[#222529]'>
              <div 
              on:click={() => changeToggleAmt({id}, 4)}
              class='text-med-gray game-btn'>+5</div>
              <div 
              on:click={() => changeToggleAmt({id}, $buildCounts[id])}
              class='title text-med-gray game-btn items-start text-center'>+all</div>
          </span> -->
         </div>

         <div 
           on:mouseover={() => getCostText({id})} 
           on:mouseover={() => getHeaderText({id})}
           on:mouseover={() => getTitleText({id})} 
           on:mouseover={() => getProducerText({id})} 
           on:mouseover={() => createUpdateInterval({id})} 
           on:mouseout={() => destroyUpdateInterval({id})} 
           on:click={() => changeToggleAmt({id}, -1)}
           class='has-tooltip mainText col-span-2 items-center text-center border-solid ml-1 p-1 mr-1
           {lockoutStyle} select-none'>-
<!--            <span class='w-[45px] tooltip shadow-lg p-1 border-white border bg-[#222529]'>
              <div 
              on:click={() => changeToggleAmt({id}, -4)}
              class='text-med-gray game-btn'>-5</div>
              <div 
              on:click={() => changeToggleAmt({id}, $buildCounts[id][1]*-1)}
              class='title text-med-gray game-btn items-start text-center'>-all</div>
          </span> -->
         </div>


        {/if}
    </div>




<script>
// @ts-nocheck

  import { res, policyBonuses, craftRes } from '../../data/player.js';
  import { builds, allGens, allBonuses, buildCounts, allSubtracts, resDeltas } from '../../data/buildings.js';
  import  fm  from '../../calcs/formulas.js'
  import {get} from 'svelte/store'
  import {onMount, onDestroy} from 'svelte'
  import {jobs} from '../../data/jobs.js'

	export let text;
  export let id;
  let titleText = '';
  let headerText = '';
  let costText = [];
  let craftCostText = [];
  let producerText = [];
  let textStyle;
  let affordStyle;  
  let toggleAffordStyle;
  let toggleableBuild = get(builds)[id.toLowerCase()]['toggleable'];
  let lockoutStyle;
  const updateInterval = 500 + Math.random()*200 // random interval
  // random intervals are used to offset updates per component so there's no "studdering"
  // where in one instance calculations need to be done for all components
  // if all calculations take more than ~5ms it will be noticable

  const decround = (n, places) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
  };

  const getPolicyBonusTotal = (bid) => {
    return 1 + 
           ((get(policyBonuses)[bid] || 0) *
           (1 + (get(policyBonuses)['global'] || 0)))
  }

  let tooltipUpdateInterval;
  let checkResUnlockInterval;
  let affordStyleInterval;

  onMount(() => { 
    id = id.toLowerCase();
    getAffordStyle(id); 
    getTextStyle(id);  
    affordStyleInterval = setInterval(() => {
      getAffordStyle(id);
      getTextStyle(id);
      getToggleAffordStyle(id);
      getLockoutStyle(id);
    }, updateInterval);
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
    let craftTakes = {} 
    for (let [type, val] of Object.entries(get(builds)[bid.id]['costs'])) {
      let ratio = get(builds)[bid.id]['ratio']
      let count = get(buildCounts)[bid.id.toLowerCase()][0]
      let req = fm.geomSequenceSum(val,ratio,count);
      if (get(res)[type][0] < req) {
        return;
      }
      else {
        takes[type] = req;
      }
    }
    if (get(builds)[bid.id]['craftCosts']) {   
      for (let [type, val] of Object.entries(get(builds)[bid.id]['craftCosts'])) {
        let ratio = get(builds)[bid.id]['ratio']
        let count = get(buildCounts)[bid.id.toLowerCase()][0]
        let req = fm.geomSequenceSum(val,ratio,count);
        if (get(craftRes)[type][0] < req) {
          return;
        }
        else {
          craftTakes[type] = req;
        }
      }
    }
    res.subMany(takes);
    if (get(builds)[bid.id]['craftCosts']) craftRes.subMany(craftTakes);
    buildCounts.add(bid.id.toLowerCase(), 1);
    if (typeof get(builds)[bid.id]['caps'] != undefined) {
      res.addCapMany(get(builds)[bid.id]['caps']);
    }
    // init new jobs if the first statue is purchased
    if (bid.id.toLowerCase() === 'statue' && get(buildCounts)['statue'][0] < 2) {
      jobs.remJob(0);
      jobs.remJob(1);
      jobs.remJob(2);
      jobs.remJob(3);
      jobs.remJob(4);
      jobs.addJob(0);
      jobs.addJob(1);
      jobs.addJob(2);
      jobs.addJob(3);
      jobs.addJob(4);
    }
    getTitleText(bid);
    getCostText(bid);
    getCraftCostText(bid);
    getProducerText(bid);
    getAffordStyle(bid.id);
    getTextStyle(bid.id);
    allGens.updateAll();
    allSubtracts.updateAll();
    allBonuses.updateAll();
    resDeltas.updateAll();
  }

  /**
	 * @param {{ id: any; }} bid
	 * @param {number} amt
	 */
  function changeToggleAmt(bid, amt, sign='+') {
    if (amt >= 0) {
      buildCounts.changeToggle(bid.id.toLowerCase(), amt);
      allGens.updateAll();
    } else {
      buildCounts.changeToggle(bid.id.toLowerCase(), amt);
      allGens.updateAll();
    }
  }

  function getTitleText(bid) {
    titleText = get(builds)[bid.id]['name'] + " (" + get(buildCounts)[bid.id.toLowerCase()][0] + ") "
  }

  function getHeaderText(bid) {
    headerText = get(builds)[bid.id]['description']
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

  function getAffordStyle(bid) {
    let canAfford = true;
    for (let [type, val] of Object.entries(get(builds)[bid]['costs'])) {
      let ratio = get(builds)[bid]['ratio']
      let count = get(buildCounts)[bid.toLowerCase()][0]
      let req = fm.geomSequenceSum(val,ratio, count);
      if (get(res)[type][1] < req && get(res)[type][1] > 0) {
        affordStyle = 'game-btn-nostorage';
        return;
      } else if (get(res)[type][0] < req) {
        affordStyle = "game-btn-noafford";
        canAfford = false;
        continue;
      }
    }
    if(get(builds)[bid]['craftCosts']) {
    for (let [type, val] of Object.entries(get(builds)[bid]['craftCosts'])) {
      let ratio = get(builds)[bid]['ratio']
      let count = get(buildCounts)[bid.toLowerCase()][0]
      let req = fm.geomSequenceSum(val,ratio, count);
      if (get(craftRes)[type][0] < req) {
        affordStyle = "game-btn-noafford";
        canAfford = false;
        return;
      }
    }
  }
     if (canAfford) affordStyle =  "game-btn";   
  }

  function getToggleAffordStyle(bid) {
    for (let [type, val] of Object.entries(get(builds)[bid]['gens'])) {
      let ratio = get(builds)[bid]['ratio']
      let count = get(buildCounts)[bid.toLowerCase()][0]
      let req = val;
      if (get(res)[type][0] < req) {
        toggleAffordStyle = 'game-btn-toggleoff';
        return;
      }   
    }
    toggleAffordStyle =  "game-btn-toggleon"; 
  }

  function getTextStyle(bid) {
    let canAfford = true;
    for (let [type, val] of Object.entries(get(builds)[bid]['costs'])) {
      let ratio = get(builds)[bid]['ratio']
      let count = get(buildCounts)[bid.toLowerCase()][0]
      let req = fm.geomSequenceSum(val,ratio, count);
      if (get(res)[type][1] < req && get(res)[type][1] > 0) {
        textStyle = 'text-nostorage';
        return;
      } else if (get(res)[type][0] < req) {
        canAfford = false;
        textStyle = "text-noafford";
        continue;
      }
    }
    if (get(builds)[bid]['craftCosts']) {
      for (let [type, val] of Object.entries(get(builds)[bid]['craftCosts'])) {
        let ratio = get(builds)[bid]['ratio']
        let count = get(buildCounts)[bid.toLowerCase()][0]
        let req = fm.geomSequenceSum(val,ratio, count);
        if (get(craftRes)[type][0] < req) {
          textStyle = "text-noafford";
          return;
        }
      }
    }
     if (canAfford) textStyle =  "text-white";   
  }
  


  function getCostText(bid) {
    let list = []
    for (let [type, val] of Object.entries(get(builds)[bid.id]['costs'])) {
      let ratio = get(builds)[bid.id]['ratio']
      let count = get(buildCounts)[bid.id.toLowerCase()][0]
      let req = fm.geomSequenceSum(val,ratio, count)
      let have = get(res)[type][0];
      let txt = (decround(get(res)[type][0], 3) + " / " + decround(req, 3)).toString();
      if (req > get(res)[type][1] && get(res)[type][1] > 0) {
        let remain = req - have;
        // in seconds vv
        let timeRemain = Math.round(remain / (5*get(resDeltas)[type]));
        let timeText = (get(allGens)[type] != 0 && !isNaN(timeRemain) ? formatToTime(timeRemain) : 'inf')
        txt = txt + "* (" + timeText + ")"
        list.push({
          type: 'text-nostorage',
          val: type,
          text: txt
        });
        continue;
      }
      if (get(res)[type][0] < req) {
        let remain = req - have;
        // in seconds vv
        let timeRemain = Math.round(remain / (5*get(resDeltas)[type]));
        let timeText = (get(allGens)[type] != 0 && !isNaN(timeRemain) ? formatToTime(timeRemain) : 'inf');
        txt += " (" + timeText + ")"
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

  function getCraftCostText(bid) {
    if (!(get(builds)[bid.id]['craftCosts'])) return;
    let list = []
    for (let [type, val] of Object.entries(get(builds)[bid.id]['craftCosts'])) {
      let ratio = get(builds)[bid.id]['ratio']
      let count = get(buildCounts)[bid.id.toLowerCase()][0]
      let req = fm.geomSequenceSum(val,ratio, count)
      let have = get(craftRes)[type][0];
      let txt = (decround(get(craftRes)[type][0], 3) + " / " + decround(req, 3)).toString();
      if (get(craftRes)[type][0] < req) {
        list.push({
          type: 'text-noafford',
          val: '[ ' + type + ' ]',
          text: txt
        });
      } else {
        list.push({
          type: 'text-white',
          val: '[ ' + type + ' ]',
          text: txt
        });
      }
    }
    craftCostText = list;
  }

  function getProducerText(bid) {
    let list = []
    for (let [type, val] of Object.entries(get(builds)[bid.id]['subtracts'])) {
        let txt = (val > 0 ? '-' : '') + decround(val*5, 3).toString() + " / sec" 
        list.push({
          type: 'afford',
          val: type,
          text: txt
        });
    }
    for (let [type, vRaw] of Object.entries(get(builds)[bid.id]['gens'])) {
        const val = vRaw * getPolicyBonusTotal(bid.id);
        let txt = (val > 0 ? '+' : '') + decround(val*5, 3).toString() + " / sec" 
        list.push({
          type: 'afford',
          val: type,
          text: txt
        });
    }
    if (typeof get(builds)[bid.id]['caps'] != undefined) {
    for (let [type, val] of (Object.entries(get(builds)[bid.id]['caps']))) {
        let txt = decround(val*getPolicyBonusTotal(bid.id), 3).toString()
        list.push({
          type: 'afford',
          val: type + ' cap:',
          text: txt
        });
      }
    }
    if (!(get(builds)[bid.id]['bonuses'] === undefined)) {
      for (let [type, vRaw] of (Object.entries(get(builds)[bid.id]['bonuses']))) {
          const val = vRaw * getPolicyBonusTotal(bid.id);
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

  function getLockoutStyle(bid) {
    for (let [type, val] of Object.entries(get(builds)[bid]['subtracts'])) {
        if (get(res)[type][3] == 1) {
          lockoutStyle = 'game-btn bg-orange-400/[0.65]';
          return;
        }
    }
    lockoutStyle = 'game-btn'
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