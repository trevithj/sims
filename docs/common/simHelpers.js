function sortByT(a, b) {
    return a.t - b.t;
}

/* Priority Queue backed by a plain array.
 Note that a Map<number, array> might be more efficient,
 except for the need for the pop method to flush the queue of any preceeding values.
*/
export function simQueue() {
    let array = [];
    return {
        add(t, value) {
            array.push({t, value});
        },
        pop(t) {
            if (array.length === 0) return [];
            const result = array.filter(d => d.t <= t).map(d => d.value);
            array = array.filter(d => d.t > t);
            return result;
        },
        size: () => array.length,
        toString: () => {
            array.sort(sortByT);
            return JSON.stringify(array.map(obj => {
                array.sort(sortByT);
                const {t, value} = obj;
                return `${t}: ${value}`;
            }));
        }
    };
}

/* Priority Queue backed by a Map.
 This version only pops the exact key match, which is much faster. 
 `It is up to calling code to handle flushing of earlier values that may have been missed.
*/
export function simMapQueue() {
    const queue = new Map();
    let length = 0;
    return {
        add(t, value) {
            const array = queue.get(t) || [];
            array.push(value);
            length += 1;
            queue.set(t, array);
        },
        pop(t) {
            const result = queue.get(t) || [];
            length -= result.length;
            queue.delete(t);
            return result;
        },
        size: () => length,
        keys: () => [...queue.keys()],
        toString: () => {
            return JSON.stringify([...queue]);
        // toString: () => {
        //     const array = [...queue].flatMap(pair => {
        //         const [t, values] = pair;
        //         return values.map(value => {
        //             return { t, value };
        //         })
        //     });
        //     array.sort(sortByT);
        //     return JSON.stringify(array.map(obj => {
        //         const {t, value} = obj;
        //         return `${t}: ${value}`;
        //     }));
        }
    };
}
// /* Priority Queue backed by a sorted array.
//  Note that a Map<number, array> might be more efficient,
//  except for the need for the pop method to flush the queue of any preceeding values.
// */
// export function simQueue() {
//     const array = [];
//     return {
//         add(t, value) {
//             array.push({t, value});
//             array.sort(sortByT);
//         },
//         pop(t) {
//             if (array.length === 0) return [];
//             if (array[0].t > t) return [];
//             const result = [];
//             while (array.length > 0 && array[0].t <= t) {
//                 const v = array.shift();
//                 result.push(v.value);
//             }
//             return result;
//         },
//         size: () => array.length,
//         toString: () => JSON.stringify(array.map(obj => {
//             const {t, value} = obj;
//             return `${t}: ${value}`;
//         }))
//     };
// }

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
            const obj = {fn, time, id: lastId};
            callbacks.push(obj);
            lastId += 1;
            return obj.id;
        },
        clearTimeout: (id) => {
            callbacks = callbacks.filter(obj => obj.id !== id);
        }
    }
    return test;
}