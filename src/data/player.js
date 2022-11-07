import {writable, get} from 'svelte/store';
import {builds} from './buildings.js';

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
		addMany(obj, multi) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type][0] = (i[type][0] + (amt*multi) < i[type][1] ? i[type][0]+(amt*multi) : i[type][1])
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
		},
		updateAllCaps() {
			update(i => {
				for (let [type, amt] of Object.entries(get(baseRes))) {
					console.log(type);
			      		i[type][1] = amt;
		      	}
				for (let [id, val] of Object.entries(get(builds))) {
					for (let [type, amt] of Object.entries(val['caps'])) {
				      		i[type][1] = (i[type][1] + amt)
			      		}
			      	}
				return i;
			});
		},
		setSelf(obj) {
			update(i => {
				i = obj;
				return i;
			})
		}
	};
}

export const res = playerRes({
	kelp: [0,500],
	sand: [0,15],
	wood: [0,15],
	fame: [0,200],
	science: [0,200]
});

export const baseRes = writable({
	kelp: [0,500],
	sand: [0,50],
	wood: [0,50],
	fame: [0,200],
	science: [0,200]
});

