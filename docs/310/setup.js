(function () {
    const Default = {
        data: {},
        macColors: {},
        info: {cash: 0, time: 0, speed: 0}
    };
    function nextStep(info) {
        return {...info, time: info.time + 1};
    }

    BASE.initState((state = Default, {type, payload}) => {
        switch (type) {
            case 'DATA_SET': {
                return {...state, ...payload}
            }
            case 'NEXT_STEP': {
                return { ...state, info: nextStep(state.info, payload) };
            }
            case 'RM_PURCHASED': {
                //TODO
                return state;
            }
            default: return state;
        }
    });
}());
