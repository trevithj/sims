// Proper PubSub methods, to allow broadcasting messages to multiple nodes.
// The subscribe function returns an unsubscribe fn.
const subscriberMap = {};

export function publish(subject, message) {
    const subscribers = subscriberMap[subject] || [];
    subscribers.forEach(subFn => {
        if (subFn && typeof subFn === "function") {
            subFn(message);
        }
    })
}

export function subscribe(subject, subFn) {
    if (typeof subFn === 'function') {
        const subscribers = subscriberMap[subject] || [];
        subscribers.push(subFn);
        subscriberMap[subject] = subscribers;
        return () => subscriberMap[subject] = subscriberMap[subject].filter(fn => fn !== subFn);
    }
}
