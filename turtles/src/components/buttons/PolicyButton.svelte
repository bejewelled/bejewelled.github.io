
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:mouseover={() => getCostText({id})} 
     on:mouseover={() => getCraftCostText({id})} 
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
                {line['type']}">{line.val}</div>
                 <div class="col-span-3 text-right pr-1
                 items-baseline {line['type']}">{line.text}</div>
              </div>
            </div>
              {/each} 
              {#each craftCostText as line1}
              <div class="row">
                <div class='grid items-start text-small grid-cols-4'>
                <div class="col-span-1 items-start text-left 
                {line1['type']}">{line1.val}</div>
                 <div class="col-span-3 text-right pr-1
                 items-baseline {line1['type']}">{line1.text}</div>
              </div>
            </div>
              {/each} 
              <div class='spacer text-small-gray pt-1 pb-1'> <hr/> </div>          
              {#each Object.entries(bonusText) as line}
              <div class="row grid-rows-6 items-baseline">
                <div class='grid text-small-gray grid-cols-6'>
                 <div class="col-span-3 text-left">{line[0]} bonus:</div>
                 <div class='col-span-3 text-left'>{decround(100*line[1])}%</div>
              </div>
            </div> 
              {/each}         
              </span>
            </div>



<script>
// @ts-nocheck

	export let text;
  export let id;
  let titleText = '';
  let headerText = '';
  let tooltipText = [];
  let craftCostText = [];
  let bonusText = {};
  $: hasStorage = checkIfStorageAvailable(id);
  let affordStyle;
  let updateInterval = 400 + Math.random() * 200
  import { res, craftRes, policyBonuses, policyTab, visible, researched, flags} from '../../data/player.js';
  import { policy } from '../../data/policy.js';
  import {builds, buildCounts, resDeltas} from '../../data/buildings.js';
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



  let tooltipUpdateInterval;
  let affordStyleInterval;

  onMount(() => {
    getTitleTextNoobject(id);
    getAffordStyle(id);   
    affordStyleInterval = setInterval(() => {
      getAffordStyle(id);
    }, 200 + Math.random()*25);
  })

  onDestroy(() => {
    clearInterval(affordStyleInterval);
  })
  // these methods allow tooltips to auto-update each second
  function createUpdateInterval(sid) {
    getBonusText(sid);
    tooltipUpdateInterval = setInterval(() => {
      getCostText(sid);
      getCraftCostText(sid);
      getBonusText(sid);
    }, updateInterval);
  }

  function destroyUpdateInterval(sid) {
    clearInterval(tooltipUpdateInterval);
  }

  function buy(sid) { 

    if ($researched['policy'].has(sid.id.toString())) {
      return;
    }
    let takes = {} 
    let craftTakes = {};  
    for (let [type, val] of Object.entries(get(policy)[sid.id]['costs'])) {
      let req = val;
      if (get(res)[type][0] < req) {
        return;
      }
      else {
        takes[type] = req;
      }
    }

    if ($policy[sid.id]['craftCosts']) {    
      for (let [type, val] of Object.entries(get(policy)[sid.id]['craftCosts'])) {
        let req = val;
        if (get(craftRes)[type][0] < req) {
          return;
        }
        else {
          craftTakes[type] = req;
        }
      }
    }

    res.subMany(takes);
    craftRes.subMany(craftTakes);
    researched.setAdd(sid.id.toString().toLowerCase(),'policy')
 // adds to researched set (unlocks it)
    policy.checkCriteria();
    // handle special cases here
    for (let i of Object.entries(get(policy)[sid.id]['bonuses'])) {
      policyBonuses.add(i[0].toLowerCase(), i[1])
    }
    policyTab.add('policiesResearched', 1);
    if ($policyTab['policiesResearched'] % 10 === 0) {
      policyTab.add('policyLevel', 1);
    }
    console.log($policyTab['policiesResearched'])
    policyBonuses.add('global', fm.calcPolicyGlobalBonus($policyTab['policyLevel']))
    getTitleText(sid);
    getAffordStyle(sid.id);
    getCostText(sid);
    policy.checkCriteria();

    if ($policy[sid.id]['updateCap']) {
      $flags['updateCapFlag'] = 1;
    }

  }

  function checkIfStorageAvailable(sid) {
  }

  function getAffordStyle(bid) {
    let canAfford = true;
    for (let [type, val] of Object.entries(get(policy)[bid]['costs'])) {
      let req = val;
      if (get(res)[type][1] < req && get(res)[type][1] > 0) {
        affordStyle = 'game-btn-nostorage';
        return;
      } else if (get(res)[type][0] < req) {
        affordStyle = "game-btn-noafford";
        canAfford = false;
        return;
      }
    }
    if ($policy[bid]['craftCosts']) { 
      for (let [type, val] of Object.entries(get(policy)[bid]['craftCosts'])) {
         let req = val;
      if (get(craftRes)[type][0] < req) {
           affordStyle = "game-btn-noafford";
           canAfford = false;
           return;
         }
       }
     }
      affordStyle =  "game-btn";   
  }

  function getTitleTextNoobject(sid) {
    titleText = get(policy)[sid]['name'];
    if ($researched['policy'].has(sid.id)) {
          titleText += ' (researched)'
    }
  }

  function getTitleText(sid) {
    titleText = get(policy)[sid.id]['name'];
    if ($researched['policy'].has(sid.id)) {
          titleText += ' (researched)'
    }
  }

  function getHeaderText(sid) {
    headerText = get(policy)[sid.id]['description']
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
    for (let [type, val] of Object.entries(get(policy)[sid.id]['costs'])) {
      let req = val;
      let have = get(res)[type][0];
      let txt = (decround(get(res)[type][0], 3) + " / " + decround(req, 3)).toString();
      let remain = req - have;
        // in seconds vv
      let timeRemain = Math.round(remain / (5*get(resDeltas)[type]));
      let timeText = (get(allGens)[type] != 0 ? formatToTime(timeRemain) : 'inf');
      if (req > get(res)[type][1] && get(res)[type][1] > 0) {
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
        let timeText = (get(allGens)[type] != 0 ? formatToTime(timeRemain) : 'inf');
        txt += " (" + timeText + ")"
        list.push({
          type: 'text-noafford',
          val: type,
          text: txt
        });
        continue;
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

  function getCraftCostText(sid) {
    if (!(get(policy)[sid.id]['craftCosts'])) return;
    let list = []
    for (let [type, val] of Object.entries(get(policy)[sid.id]['craftCosts'])) {
      let req = val;
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


  function getBonusText(sid) {
      bonusText = get(policy)[sid.id]['bonuses'];
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