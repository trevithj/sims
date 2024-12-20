import {publish, subscribe} from "../pubsub.js";

const display = (vals, element) => {
    const time = vals.dt.toTimeString().substring(0, 5);
    const revenue = vals.fgSold * 300;
    const expenses = vals.rmBought * 50;

    element.textContent = [
        `Time:  ${time}  Cash: $${vals.cash}.`,
        "",
        'Revenue:',
        `  Sales:       $${revenue}`,
        'Less expenses:',
        `  Daily (due): $4000`,
        `  RM cost:     $${expenses}`,
        '  ==================',
        `  Net profit   $${revenue - 4000 - expenses}`,
        '  ==================',
        vals.message
    ].join("\r\n");
}

export function makeOutput(initialCash = 1000, element) {
    const dt = new Date("2000-01-01T00:00");
    const refTime = dt.getTime();
    const vals = {
        cash: initialCash,
        ticks: 0,
        rmBought: 0,
        fgSold: 0,
        dt,
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

    const OUT = {
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
        display: () => display(vals, element)
    };
    return OUT;
}
