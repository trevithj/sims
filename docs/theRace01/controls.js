import {subscribe} from "../pubsub.js";

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
    subscribe("RM-Added", (d) => { vals.rmBought += d.qty; });
    subscribe("FG-Added", () => { vals.fgSold += 1; });
    function updateCash(d) {
        vals.cash += d;
        if (vals.cash < 0) { 
            vals.message = "You are bankrupt!";
            vals.ticks = 9999;
        }
    }

    const DATA = {
        get time() { return dt.toTimeString().substring(0, 5); },
        get cash() {return vals.cash;},
        get revenue() {return vals.fgSold * 30 },
        get expenses() {return vals.rmBought * 10 },
        updateCash,
        get ticks() {return vals.ticks;},
        tick() {
            vals.ticks += 1;
            dt.setTime(refTime + 60000 * vals.ticks);
        },
        get hasFinished() {return vals.ticks >= 480;},
        get hasFailed() {return vals.cash < 0;},
        get message() {return vals.message;},
        job: "a0",
        worker: "ready"
    };
    DATA.display = display(DATA, element);
    DATA.isReady = id => DATA.job === id && DATA.worker === "ready";
    return DATA;
}
