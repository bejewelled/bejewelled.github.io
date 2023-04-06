<div class='grid grid-cols-7 items-center'>
	<div class='col-span-1 {getColor(index)}'>{getRarity(index)} </div>
	<div class='col-span-2 {getColor(index)}'>({decround(prob(index), 3)}%)</div>
	<div class='col-span-2 {getColor(index)}'>{decround($magicTab['sigils'][index], 0)} </div>
	<div class='col-span-2 {getColor(index)}'>{index === 0 ? '+' : 'x'}{decround(powerGen(index), 3)}
	{index === 0 ? '/sec' :''}</div>
</div>


<script>
import {magicTab} from '../../data/player.js'
import fm from '../../calcs/formulas.js'
export let index;

const decround = (n, places) => {
    if (n < 1e3) return n.toLocaleString();
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(places) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(places) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(places) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(places) + "T";
};


$: prob = (i) => {
    return fm.getSigilProbTableIndex($magicTab['sigilsBought'], i)
};

$: powerGen = (i) => {
	return fm.getSigilPowerArray($magicTab['sigils'])[i];
}


function getColor (i) {
	const colors = [
	'text-white',
	'text-green-500',
	'text-cyan-500',
	'text-violet-500',
	'text-fuchsia-500',
	'text-orange-500',
	'text-yellow-500'
	]
	return colors[i];
}

function getRarity (i) {
	const rarity = [
	'Common',
	'Uncommon',
	'Rare',
	'Legendary',
	'Mystical',
	'Exotic',
	'Divine'
	]
	return rarity[i];
}




</script>


<style type="text/css"></style>