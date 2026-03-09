import { EVENTS } from "../../../core/constants.js";
import { getGoogleScore, getPlayerScore, subscribe, unsubscribe } from "../../../core/state-manager.js";
import { TimerComponent } from "../Timer/Timer.component.js";

export function ResultPanelComponent() {
    const element = document.createElement('div');
    element.classList.add('result-panel');
    
    const observer = (e) => {
        if(e.name === EVENTS.SCORES_CHANGED) render(element);
    }
    subscribe(observer);

    render(element);

    return {element, unsubscribe: () => observer(element)} 
}


 async function render(element) {
    element.innerHTML = '';
    const googleScore = await getGoogleScore()
    const player1Score = await getPlayerScore(1);
    const player2Score = await getPlayerScore(2);

    element.append(`Player1: ${player1Score}, Player2: ${player2Score}, Google: ${googleScore}`);
};