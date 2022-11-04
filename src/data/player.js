import {writable} from 'svelte/store';

function playerRes(info) {
	const { subscribe, set, update, get } = writable(info);

	return {
		subscribe,
		add(type, amt) {
			update(i => {
	      		i[type][0] = (i[type][0] + amt < i[type][1] ? i[type][0]+amt : i[type][1])
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		addMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type][0] = (i[type][0] + amt < i[type][1] ? i[type][0]+amt : i[type][1])
		      		return i;
	      		})
	      	}
		},
		addCap(type, amt) {
			update(i => {
	      		i[type][1] = (i[type][1] + amt)
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		addCapMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type][1] = (i[type][1] + amt)
		      		return i;
	      		})
	      	}
		},
		sub(type, amt) {
			update(i => {
	      		i[type][0] = (i[type][0] - amt > 0 ? i[type][0]-amt : 0)
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		subMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type][0] = (i[type][0] - amt > 0 ? i[type][0]-amt : 0)
		      		return i;
	      		})
	      	}
		},
		// note that set overrides any resource caps, so don't use this unless necessary!
		set(type, amt) {
			update(i => {
	      		i[type][0] = amt;
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		setMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type][0] = amt;
		      		return i;
	      		})
	      	}
		},
		setCap(type, amt) {
			update(i => {
	      		i[type][1] = amt;
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		setCapMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type][1] = amt;
		      		return i;
	      		})
	      	}
		}
	};
}

export const res = playerRes({
	kelp: [0,300],
	sand: [0,15],
	wood: [0,15],
	fame: [0,200],
	science: [0,200]
});
