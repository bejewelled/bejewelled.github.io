import {writable} from 'svelte/store';

function playerRes(info) {
	const { subscribe, set, update, get } = writable(info);

	return {
		subscribe,
		add(type, amt) {
			update(i => {
	      		i[type] = (i[type] + amt < i[type+'Max'] ? i[type]+amt : i[type+'Max'])
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		addMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type] = (i[type] + amt < i[type+'Max'] ? i[type]+amt : i[type+'Max'])
		      		return i;
	      		})
	      	}
		},
		sub(type, amt) {
			update(i => {
	      		i[type] = (i[type] - amt > 0 ? i[type]-amt : 0)
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		subMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type] = (i[type] - amt > 0 ? i[type]-amt : 0)
		      		return i;
	      		})
	      	}
		},
		// note that set overrides any resource caps, so don't use this unless necessary!
		set(type, amt) {
			update(i => {
	      		i[type] = amt;
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		setMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type] = amt;
		      		return i;
	      		})
	      	}
		}
	};
}

export const res = playerRes({
	kelp: 0,
	kelpMax: 300,
	sand: 0,
	sandMax: 15,
});

export const startingRes = playerRes({
	kelp: 0,
	kelpMax: 100000,
	sand: 0,
	sandMax: 15,
});