import {publish, subscribe} from "../pubsub.js";

const display = (data, element) => () => {
    const { revenue, expenses } = data;
    element.textContent = [
        `Time:  ${data.time}  Cash: $${data.cash}.`,
        "",
        'Revenue:',
        `  Sales:       $${revenue}`,
        'Less expenses:',
        `  Daily (due): $4000`,
        `  RM cost:     $${expenses}`,
        '  ==================',
        `  Net profit   $${revenue - 4000 - expenses}`,
        '  ==================',
        data.message
    ].join("\r\n");
}

export function getData(initialCash = 1000, element) {
    const dt = new Date("2000-01-01T00:00");
    const refTime = dt.getTime();
    const vals = {
        cash: initialCash,
        ticks: 0,
        rmBought: 0,
        fgSold: 0,
        message: null
    }
    function updateCash(d) {
        vals.cash += d;
        if (vals.cash < 0) { 
            vals.message = "You are bankrupt!";
            publish("SimFinished", "NoMoreCash");
        }
    }
    subscribe("StoreUpdated", d => {
        if (d.storeId === "rm" && d.delta > 0) {
            vals.rmBought += d.delta; 
            updateCash(-d.delta*50);
        } else if (d.storeId === "fg") {
            vals.fgSold += 1; 
            updateCash(300);
        }
    });

    const DATA = {
        get time() { return dt.toTimeString().substring(0, 5); },
        get cash() {return vals.cash;},
        get revenue() {return vals.fgSold * 300 },
        get expenses() {return vals.rmBought * 50 },
        updateCash,
        get ticks() {return vals.ticks;},
        tick() {
            vals.ticks += 1;
            dt.setTime(refTime + 60000 * vals.ticks);
            if (vals.ticks >= 480) {
                updateCash(-4000);
                publish("SimFinished", "TimeIsUp");
            }
        },
        get hasFinished() {return vals.ticks >= 480;},
        get message() {return vals.message;},
        job: "ab",
        worker: "ready"
    };
    DATA.display = display(DATA, element);
    DATA.isReady = id => DATA.job === id && DATA.worker === "ready";
    return DATA;
}

export function doTick() {

}
