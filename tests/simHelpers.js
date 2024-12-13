function sortByT(a,b) {
    return a.t - b.t;
}

export function simQueue() {
    const array = [];
    return {
        add: (t, value) => {
            array.push({ t, value });
            array.sort(sortByT);
        },
        pop: (t) => {
            if (array.length === 0) return [];
            if (array[0].t > t) return [];
            const result = [];
            while(array.length > 0 && array[0].t <= t) {
                const v = array.shift();
                result.push(v.value);
            }
            return result;
        },
        toString: () => JSON.stringify(array.map(obj => {
            const { t, value } = obj;
            return `${t}: ${value}`;
        }))
    };
}
