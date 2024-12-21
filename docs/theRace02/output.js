import {publish, subscribe} from "../pubsub.js";

const FG_SALE = 300; // revenue per unit
const RM_COST = 100; // expense per unit

const display = (vals, element) => {
    const time = vals.dt.toTimeString().substring(0, 5);
    const revenue = vals.fgSold * FG_SALE;
    const expenses = vals.rmBought * RM_COST;

    element.textContent = [
        `Time:  ${time}  Cash: $${vals.cash}.`,
        "",
        'Revenue:',
        `  Sales:       $${revenue}`,
        'Less expenses:',
        `  Daily:       $${vals.daily}`,
        `  RM cost:     $${expenses}`,
        '  ==================',
        `  Net profit   $${revenue - vals.daily - expenses}`,
        '  ==================',
        vals.message
    ].join("\r\n");
}

export function makeOutput(initialCash = 2000, element) {
    const dt = new Date("2000-01-01T00:00");
    const refTime = dt.getTime();
    const vals = {
        cash: initialCash,
        daily: 0,
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
            updateCash(-d.delta*RM_COST);
        } else if (d.storeId === "fg") {
            vals.fgSold += 1; 
            updateCash(FG_SALE);
        }
    });

    const OUT = {
        tick() {
            vals.ticks += 1;
            dt.setTime(refTime + 60000 * vals.ticks);
            if (vals.ticks % 480 === 0) {
                vals.daily += 4000;
                updateCash(-4000);
            }
            if (vals.ticks >= 960) {
                publish("SimFinished", "TimeIsUp");
            }
        },
        get hasFinished() {return vals.ticks >= 960;},
        get message() {return vals.message;},
        job: "ab",
        display: () => display(vals, element)
    };
    return OUT;
}
