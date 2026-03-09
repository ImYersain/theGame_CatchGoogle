import { EVENTS, GAME_STATUS, MOVING_DIRECTIONS } from "./constants.js";

const _state = {
    gameStatus: GAME_STATUS.SETTINGS,
    settings: {
        gridSize: {
            columnsCount:5,
            rowsCount: 5
        },
        /* In milliseconds  */
        googleJumpIntervalTime: 5000,
        pointsToLose: 3,
        pointsToWin:3,
        soundsEnabled: true
    },
    score: {
        google: 0,
        players: [0 , 0]
    },
    positions: {
        google: {
            x: 1, y: 0
        },
        players: [{x: 0, y: 0}, {x: 1, y: 1}]
    },
};

const _generateIntegerNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _jumpGoogleToNewPosition() {
    const newPosition = {..._state.positions.google};

    do {
        newPosition.x = _generateIntegerNumber(0, _state.settings.gridSize.columnsCount - 1);
        newPosition.y = _generateIntegerNumber(0, _state.settings.gridSize.rowsCount - 1);
    } while (
        _checkGooglePosition(newPosition) || _checkPlayer1Position(newPosition) || _checkPlayer2Position(newPosition)
    )

    _state.positions.google = newPosition;
}


//OBSERVER
let _observers = [];
export const subscribe = (observer) => {
    _observers.push(observer);
}
export const unsubscribe = (observer) => {
    _observers = _observers.filter(o => o !== observer)
}

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
}



//INTERFACE/ADAPTER

//GETTERS/SELECTORS
export const _getIndexPlayerByNumber = (playerNumber) => {
    const playerIndex = playerNumber - 1;

    if(playerIndex < 0 || playerIndex > _state.score.players.length - 1) {
        throw new Error(`Player number ${playerNumber} is out of bounds`);
    }

    return playerIndex;
}

export const getGoogleScore = async () => _state.score.google;

export const getPlayerScore = async (playerNumber) => {
    const playerIndex = _getIndexPlayerByNumber(playerNumber);

    return _state.score.players[playerIndex];
};

export const getGridSize = async () => {
    return {..._state.settings.gridSize};
}

export const getSettings = async () => {
    return {
        gridSize: {..._state.settings.gridSize},
        googleJumpIntervalTime: _state.settings.googleJumpIntervalTime,
        pointsToLose: _state.settings.pointsToLose,
        pointsToWin: _state.settings.pointsToWin,
        soundsEnabled: _state.settings.soundsEnabled
    }
}

export const getGooglePosition = async () => {
    return {..._state.positions.google};
}

export const getPlayersPosition = async (playerNumber) => {
    const playerIndex = _getIndexPlayerByNumber(playerNumber)

    return {..._state.positions.players[playerIndex]}
}

export const _getGameStatus = async () => {
    return _state.gameStatus
};

//VALIDATION FUNCTIONS
const _isPositionInValidRange = (position) => {
    if(position.x < 0 || position.x >= _state.settings.gridSize.columnsCount) return false;
    if(position.y < 0 || position.y >= _state.settings.gridSize.rowsCount) return false;

    return true;
}

const _checkPlayer1Position = (position) => {
    return position.x === _state.positions.players[0].x && position.y === _state.positions.players[0].y;
}

const _checkPlayer2Position = (position) => {
    return position.x === _state.positions.players[1].x && position.y === _state.positions.players[1].y;
}

const _checkGooglePosition = (position) => {
    return position.x === _state.positions.google.x && position.y === _state.positions.google.y;
}

const _catchGoogle = (playerNumber) => {
    const playerIndex = _getIndexPlayerByNumber(playerNumber);
    
    _state.score.players[playerIndex]++;
    _notifyObservers(EVENTS.SCORES_CHANGED);
    _notifyObservers(EVENTS.GOOGLE_CAUGHT);

 
    if(_state.score.players[playerIndex] === _state.settings.pointsToWin) {
        _state.gameStatus = GAME_STATUS.WIN; 
        _notifyObservers(EVENTS.STATUS_CHANGED);
        clearInterval(googleJumpInterval);
    } else {
        const oldPosition = _state.positions.google;
        _jumpGoogleToNewPosition();
        _notifyObservers(EVENTS.GOOGLE_JUMPED, {
            oldPosition,
            newPosition: _state.positions.google
        });
    }
}


//COMMANDS/SETTER
let googleJumpInterval;
export const startGame = async () => {
    if(_state.gameStatus !== GAME_STATUS.SETTINGS) throw new Error(`Incorrect transition from ${_state.gameStatus} to ${GAME_STATUS.IN_PROGRESS}`)

    _state.positions.players[0] = {x: 0, y: 0};
    _state.positions.players[1] = {x: _state.settings.gridSize.columnsCount - 1, y: _state.settings.gridSize.rowsCount - 1};
   
    _jumpGoogleToNewPosition();

    _state.score.google = 0;
    _state.score.players = [0, 0];

    googleJumpInterval = setInterval(() => {
        const prevPosition = {..._state.positions.google};
        _jumpGoogleToNewPosition();
        _notifyObservers(EVENTS.GOOGLE_JUMPED, {
            prevPosition,
            newPosition: {..._state.positions.google}
        });

        _state.score.google++;
        _notifyObservers(EVENTS.SCORES_CHANGED);
        _notifyObservers(EVENTS.GOOGLE_RUNAWAY);
    
        if(_state.score.google === _state.settings.pointsToWin) {
            clearInterval(googleJumpInterval);
            _state.gameStatus = GAME_STATUS.LOSE;
            _notifyObservers(EVENTS.STATUS_CHANGED);
        }

    }, _state.settings.googleJumpIntervalTime);

    _state.gameStatus = GAME_STATUS.IN_PROGRESS;
    _notifyObservers(EVENTS.STATUS_CHANGED);
}

export const restartGame = async () => {
    _state.gameStatus = GAME_STATUS.SETTINGS;
    _notifyObservers(EVENTS.STATUS_CHANGED);
}

export const stopGame = async () => {
    if(_state.gameStatus !== GAME_STATUS.IN_PROGRESS) {
        console.warn('Game is not in progress, so it cannot be stopped');
        return;
    }

    clearInterval(googleJumpInterval);
    _state.gameStatus = GAME_STATUS.SETTINGS;
    _notifyObservers(EVENTS.STATUS_CHANGED);
}

export const changeSettingsGridSize = async (newColumnsCount, newRowsCount) => {
    if(_state.gameStatus !== GAME_STATUS.SETTINGS) {
        console.warn('You should first stop the game if you want to change the settings')
        return;
    }
    _state.settings.gridSize = {
        columnsCount: newColumnsCount,
        rowsCount: newRowsCount
    }
    _notifyObservers(EVENTS.SETTINGS_CHANGED);
}

export const changeSettingsPointsToWin = async (newPointsToWin) => {
    if(_state.gameStatus !== GAME_STATUS.SETTINGS) {
        console.warn('You should first stop the game if you want to change the settings')
        return;
    }
    _state.settings.pointsToWin = newPointsToWin;
    _notifyObservers(EVENTS.SETTINGS_CHANGED);
}

export const changeSettingsPointsToLose = async (newPointsToLose) => {
    if(_state.gameStatus !== GAME_STATUS.SETTINGS) {
        console.warn('You should first stop the game if you want to change the settings')
        return;
    }
    _state.settings.pointsToLose = newPointsToLose;
    _notifyObservers(EVENTS.SETTINGS_CHANGED);
}

export const changeSettingsHandleSound = async (soundEnabled) => {
    _state.settings.soundsEnabled = soundEnabled;
    _notifyObservers(EVENTS.SETTINGS_CHANGED);
}

export const movePlayer = async (playerNumber, direction) => {
    if(_state.gameStatus !== GAME_STATUS.IN_PROGRESS) {
        console.warn('You should first start the game if you want to move your player')
        return;
    }

    const playerIndex = _getIndexPlayerByNumber(playerNumber);
    const oldPosition = {..._state.positions.players[playerIndex]};
    const newPosition = {..._state.positions.players[playerIndex]};

    switch (direction) {
        case MOVING_DIRECTIONS.UP:
            newPosition.y--;
            break;
        case MOVING_DIRECTIONS.DOWN: 
            newPosition.y++;
            break;
        case MOVING_DIRECTIONS.RIGHT:
            newPosition.x++;
            break;
        case MOVING_DIRECTIONS.LEFT:
            newPosition.x--;
            break;
    }

    const isValidRange = _isPositionInValidRange(newPosition);
    if(!isValidRange) return;

    const isPlayer1PositionTheSame = _checkPlayer1Position(newPosition);
    if(isPlayer1PositionTheSame) return;

    const isPlayer2PositionTheSame = _checkPlayer2Position(newPosition);
    if(isPlayer2PositionTheSame) return;

    const isGooglePositionTheSame = _checkGooglePosition(newPosition);
    if(isGooglePositionTheSame) {
        _catchGoogle(playerNumber);
    }

    
    _state.positions.players[playerIndex] = newPosition;
    _notifyObservers(EVENTS[`PLAYER${playerNumber}_MOVED`], {
        oldPosition: oldPosition,
        newPosition: newPosition
    });
}
