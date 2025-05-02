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
 It is up to calling code to handle flushing of earlier values that may have been missed.
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
        toString: () => JSON.stringify([...queue])
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

// Perplexity suggested a linked-list implementation.
// https://www.perplexity.ai/search/how-can-a-linked-list-be-imple-Hug7Q_rdQf6v2Zlt3fYRSQ

export function makePriorityQueue() {

    let head = null;

    function enqueue(value, priority) {
        const newNode = {value, priority, next: null};
        if (!head || priority < head.priority) {
            newNode.next = head;
            head = newNode;
        } else {
            let current = head;
            while (current.next && current.next.priority <= priority) {
                current = current.next;
            }
            newNode.next = current.next;
            current.next = newNode;
        }
    }

    function dequeue() {
        if (!head) return null;
        const value = head.value;
        head = head.next;
        return value;
    }

    function peek() {
        return head ? head.value : null;
    }
    function peekPriority() {
        return head ? head.priority : Number.MAX_SAFE_INTEGER;
    }

    // Traverse and print all node values
    function traverse(cb) {
        let current = head;
        while (current) {
            cb(current.value, current.priority);
            current = current.next;
        }
    }

    function remove(evalFn) {
        // Remove matching head nodes
        while (head && evalFn(head.value, head.priority)) {
            head = head.next;
        }
        if (head === null || !head.next) return; // check for empty list
        let current = head.next;
        let prev = head;
        while (current) {
            if (evalFn(current.value, current.priority)) {
                prev.next = current.next; // Remove current node
            } else {
                prev = current;
            }
            current = current.next;
        }
    }

    return {enqueue, dequeue, peek, peekPriority, traverse, remove};
}
