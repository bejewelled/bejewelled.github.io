import {writable} from 'svelte/store'
function buildings(info) {
	const { subscribe, set, update } = writable(info);

	return {
		subscribe,
		add(type, amt) {
			update(i => {
	      		i[type] = (i[type] + amt < i[type+'Max'] ? i[type]+amt : i[type+'Max'])
	      		return i;
      		})
		},
	}
}

export const builds = buildings({
	'0': {
		id: 0,
		name: 'Kelp Farm',
		description: 'Harvests some kelp from the magical universe that helps those in need.',
		count: 0,
		costs: {
			kelp: 20
		},
		ratio: 1.15,
		gens: {
			kelp: 0.2
		}
	}


})