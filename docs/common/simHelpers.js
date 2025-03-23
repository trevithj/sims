function sortByT(a, b) {
    return a.t - b.t;
}

export function simQueue() {
    const array = [];
    return {
        add(t, value) {
            array.push({t, value});
            array.sort(sortByT);
        },
        pop(t) {
            if (array.length === 0) return [];
            if (array[0].t > t) return [];
            const result = [];
            while (array.length > 0 && array[0].t <= t) {
                const v = array.shift();
                result.push(v.value);
            }
            return result;
        },
        size: () => array.length,
        toString: () => JSON.stringify(array.map(obj => {
            const {t, value} = obj;
            return `${t}: ${value}`;
        }))
    };
}

export function simTimer() {
    let currentSimTime = 0;
    let lastId = 0;
    let callbacks = [];
    const test = {
        get time() {
            return currentSimTime;
        },
        set time(t) {
            if (t < currentSimTime) throw Error("Can't set time backwards");
            currentSimTime = t;
            const toCall = callbacks.flatMap(obj => {
                if (obj.time > currentSimTime) return [];
                return [obj.fn];
            });
            callbacks = callbacks.filter(obj => obj.time > currentSimTime);
            toCall.forEach(fn => fn());
        },
        setTimeout: (fn, time) => {
            const obj = { fn, time, id:lastId };
            callbacks.push(obj);
            lastId +=1;
            return obj.id;
        },
        clearTimeout: (id) => {
            callbacks = callbacks.filter(obj => obj.id !== id);
        }
    }
    return test;
}