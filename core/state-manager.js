const eventSource = new EventSource('http://localhost:3000/events');

eventSource.addEventListener('message', (eventSourceEvent) => {
    const event = JSON.parse(eventSourceEvent.data);

    _notifyObservers(event.name, event.payload);
});

//OBSERVER
let _observers = [];
export const subscribe = (observer) => {
    _observers.push(observer);
};
export const unsubscribe = (observer) => {
    _observers = _observers.filter(o => o !== observer)
};

const  _notifyObservers = (name, payload = {}) => {
    const event = {
        name,
        payload
    }

    _observers.forEach((o) => {
        try {
            o(event)
        } catch (error) {
            console.error(error)
        }
    })
};



//INTERFACE/ADAPTER

//GETTERS/SELECTORS
export const _getIndexPlayerByNumber = (playerNumber) => {
};

export const getGoogleScore = async () => {
    const res = await fetch('http://localhost:3000/getGoogleScore');
    const resJson = await res.json();
    return resJson.data;
};

export const getPlayerScore = async (playerNumber) => {
    const res = await fetch('http://localhost:3000/getPlayerScore?playerNumber=' + playerNumber);
    const resJson = await res.json();
    return resJson.data;
};

export const getGridSize = async () => {
    const res = await fetch('http://localhost:3000/getGridSize');
    const resJson = await res.json();
    return resJson.data;
};

export const getSettings = async () => {
    const res = await fetch('http://localhost:3000/getSettings');
    const resJson = await res.json();
    return resJson.data;
};

export const getGooglePosition = async () => {
    const res = await fetch('http://localhost:3000/getGooglePosition');
    const resJson = await res.json();
    return resJson.data;
};

export const getPlayersPosition = async (playerNumber) => {
    const res = await fetch('http://localhost:3000/getPlayersPosition?playerNumber=' + playerNumber);
    const resJson = await res.json();
    return resJson.data;
};

export const _getGameStatus = async () => {
    const res = await fetch('http://localhost:3000/getGameStatus');
    const resJson = await res.json();
    return resJson.data;
};


//COMMANDS/SETTER
let googleJumpInterval;
export const startGame = async () => {
    fetch('http://localhost:3000/startGame');
};

export const restartGame = async () => {
    fetch('http://localhost:3000/restartGame');
};

export const stopGame = async () => {
    fetch('http://localhost:3000/stopGame');
};

export const movePlayer = async (playerNumber, direction) => {
    fetch(`http://localhost:3000/movePlayer?playerNumber=${playerNumber}&direction=${direction}`);
};

export const changeSettingsGridSize = async (newColumnsCount, newRowsCount) => {
}

export const changeSettingsPointsToWin = async (newPointsToWin) => {
}

export const changeSettingsPointsToLose = async (newPointsToLose) => {
}

export const changeSettingsHandleSound = async (soundEnabled) => {
}
