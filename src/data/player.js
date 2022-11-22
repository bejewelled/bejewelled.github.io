import {writable, get} from 'svelte/store';
import {builds} from './buildings.js';

function playerRes(info) {
	const { subscribe, set, update, get } = writable(info);

	return {
		subscribe,
		add(type, amt) {
			update(i => {
					if (i[type][1] > -0.9) {
		      			i[type][0] = (i[type][0] + (amt) < i[type][1] ? i[type][0]+(amt) : i[type][1])
		      			return i;
		      		} else {
		      			i[type][0] += amt;
		      			return i;
		      		}      		
		     })
		},
		// adds many at once with typical object format (type: amt)
		addMany(obj, multi) {
			update(i => {
				for (let [type, amt] of Object.entries(obj)) {
					if (amt >= 0) {
						if (i[type][1] > -0.9) {
			      			i[type][0] = (i[type][0] + (amt*multi) < i[type][1] ? i[type][0]+(amt*multi) : i[type][1])
			      			
			      		} else {
			      			i[type][0] += amt*multi;
			      			
			      		}
			      	} else {
			      		i[type][0] = (i[type][0] + (amt*multi) > 0 ? i[type][0]-(amt*multi) : 0)
			      	}
				}
				return i;
	    	})
	      	
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
		setSelf(obj) {
			update(i => {
				i = obj;
				return i;
			})
		},
		clear() {
			update(i => {
				for (let c of Object.entries(i)) {
					i[c[0]][0] = 0;
				}
				return i;
			});
		}
	};
}

function noCapOperator(info) {
	const { subscribe, set, update, get } = writable(info);

	return {
		subscribe,
		add(type, amt) {
			update(i => {
	      		i[type] += amt;
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		addMany(obj, multi) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type] += amt;
		      		return i;
	      		})
	      	}
		},
		sub(type, amt) {
			update(i => {
	      		i[type] -= amt;
	      		return i;
      		})
		},
		// adds many at once with typical object format (type: amt)
		subMany(obj) {
			for (let [type, amt] of Object.entries(obj)) {
				update(i => {
		      		i[type] -= amt;
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
		},
		setSelf(obj) {
			update(i => {
				i = obj;
				return i;
			})
		}
	};
}


// index 0 - the resource amount
// index 1 - the cap amount, or -1 if uncapped
export const res = playerRes({
	kelp: [0,500],
	sand: [0,50],
	wood: [0,50],
	copper: [0,100],
	iron: [0,100],
	coal: [0, 50],
	science: [0,200],
	fame: [0,-1],
	glory: [0,-1]
});


export const baseRes = playerRes({
	kelp: [0,500],
	sand: [0,50],
	wood: [0,50],
	copper: [0,100],
	iron: [0,100],
	coal: [0, 50],
	science: [0,200],
	fame: [0,-1],
	glory: [0,-1]
});


export const gloryBonuses = noCapOperator({
	'Production Bonus': 0,
	'Cost Ratio Reduction': 0
})