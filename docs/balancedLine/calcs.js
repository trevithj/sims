(function () {
	const rnd = {}; //map string to random float
	const random = (max, state, i) => {
		const key = `${state.tick}:${i}`;
		const r = rnd[key] || Math.random();
		rnd[key] = r; //re-use
		return Math.ceil(r * max);
	}
	const last = a => a[a.length-1];

	const INITIAL_RM = 1500;
	const MONEY = {
		variable: 0,
		fixed: 0,
		revenue: 0,
		wip: 30,
	};
	const STATS = {
		meanCap: [0,0,0,0,0,0,0],
		meanAct: [0,0,0,0,0,0,0],
	};

	BASE.makeLine = id => {
		const rm = INITIAL_RM;
		const stores = [5,5,5,5,5,5,0];
		const tick = 0;
		const ops = [0,0,0,0,0,0,0];
		const money = {...MONEY};
		const stats = {...STATS};
		return { id, rm, stores, tick, ops, money, stats };
	};

	const getSt = state => {
		return [state.rm].concat(state.stores.slice(0, -1));
	};

	//returns array of arrays [[capacity, maximumAvailable], ...]
	const nextOpsFns = [
		state => getSt(state).map(v => [3, v]),
		state => getSt(state).map((v,i) => [random(3, state, i)+1, v]),
		state => getSt(state).map((v,i) => [random(5, state, i), v]),
		state => getSt(state).map((v,i) => [random(7, state, i)-1, v]),
//		state => getSt(state).map((v,i) => i===0 ? [random(6, state, i)-1, v] : [random(7, state, i)-1, v]),
	];

	const nextMoney = (state, ops) => {
		const { money, stores } = state;
		const newMoney = {...money };
		newMoney.fixed += 2; //$2 per tick
		newMoney.variable += (3 * ops[0]); // $3 per unit
		newMoney.revenue += (4 * last(ops)); //$4 per unit
		const fg = last(stores);
		// newMoney.wip = -fg + stores.reduce((acc, cur) => acc + cur);
		newMoney.wip = money.wip + ops[0] - last(ops);
		return newMoney;
	}

	const nextStats = (state, rawOps, acts) => {
		const { stats, tick } = state;
		const caps = rawOps.map(va => va[0]);
//		const acts = rawOps.map(va => Math.min(va[0], va[1]));
		const meanCap = stats.meanCap.map((last, i) => {
			return ((last * tick) + caps[i]) / (tick + 1);
		});
		const meanAct = stats.meanAct.map((last, i) => {
			return ((last * tick) + acts[i]) / (tick + 1);
		});

		const newStats = { ...stats, meanCap, meanAct };
		return newStats;
	}

	//TODO: read isCapped from query parameter, and use it to control display
	//That way we can use the same code base to run unbalanced version too.
	BASE.nextState = (thisState, n) => {
		const nextOps = nextOpsFns[n];
		const { tick, rm, stores } = thisState; //assume a line object
		const rawOps = nextOps(thisState);
		const ops = rawOps.map(([cap, act]) => Math.min(cap, act));
		if(BASE.version === 'capped') { //limit input to match output
			ops[0] = last(ops);
		}
		const st = [rm].concat(stores);
		ops.forEach((d, i) => {
			st[i] -= d;
			st[i+1] += d;
		});

		const money = nextMoney(thisState, ops);
		const stats = nextStats(thisState, rawOps, ops);
		return {
			...thisState,
			tick: tick + 1,
			rm: st[0],
			stores: st.slice(1),
			ops, money, stats
		};
	};

})();
