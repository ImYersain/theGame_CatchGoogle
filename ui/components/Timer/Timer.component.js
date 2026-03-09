import { EVENTS, GAME_STATUS } from "../../../core/constants.js";
import { subscribe, unsubscribe, _getGameStatus } from "../../../core/state-manager.js";

export function TimerComponent() {
    const element = document.createElement('div');
    element.classList.add('timer');

    let intervalId = null;
    let seconds = 0;

    const render = () => {
        element.textContent = `Time: ${seconds}s`;
    }

    const start = () => {
        stop();
        seconds = 0;
        render();
        intervalId = setInterval(() => {
            seconds++;
            render();
        }, 1000);
    }

    const stop = () => {
        if(intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    const observer = async (e) => {
        if(e.name !== EVENTS.STATUS_CHANGED) return;
        try {
            const status = await _getGameStatus();
            if(status === GAME_STATUS.IN_PROGRESS) start();
            else stop();
        } catch (err) {
            console.log('Error fetching game status in timer component:', err);
        }
    }

    // initialize according to current status
    (async () => {
        try {
            const status = await _getGameStatus();
            if(status === GAME_STATUS.IN_PROGRESS) start(); else render();
        } catch (err) {
            render();
        }
    })();

    subscribe(observer);

    return {element, cleanup: () => {
        stop();
        unsubscribe(observer);
    }}
}