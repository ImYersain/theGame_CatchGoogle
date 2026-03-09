import { GAME_STATUS } from "../../core/constants.js";
import { _getGameStatus, subscribe } from "../../core/state-manager.js";
import { AudioComponent } from "./Audio/Audio.component.js";
import { GridComponent } from "./Grid/Grid.component.js";
import { LoseComponent } from "./Lose/Lose.component.js";
import { ResultPanelComponent } from "./ResultPanel/ResultPanel.component.js";
import { SettingsComponent } from "./Settings/Settings.component.js";
import { StartButtonComponent } from "./Start/Start.component.js";
import { TimerComponent } from "./Timer/Timer.component.js";
import { WinComponent } from "./Win/Win.component.js";

export function AppComponent() {
    const element = document.createElement('div');
    const localState = {prevGameStatus: null,  cleanupFunctions: []};
    const audioComponent = AudioComponent();
    

    subscribe(() => {
        render(element, localState);
    });

    render(element, localState);

    return {element}
}

async function render(element, localState) {
    const gameStatus = await _getGameStatus();

    if(localState.prevGameStatus === gameStatus) return;
    localState.prevGameStatus = gameStatus;
    
    localState.cleanupFunctions.forEach((fn) => fn());
    localState.cleanupFunctions = [];

    element.innerHTML = '';

    switch (gameStatus) {
        case GAME_STATUS.SETTINGS: {
            const settingsComponent = SettingsComponent();
            const startButtonComponent = StartButtonComponent();
            localState.cleanupFunctions.push(settingsComponent.cleanup || (() => {}));
            element.append(settingsComponent.element, startButtonComponent.element);
            break;
        }
        case GAME_STATUS.IN_PROGRESS: {
            const gridComponent = GridComponent();
            const settingsComponent = SettingsComponent();
            const resultPanelComponent = ResultPanelComponent();
            const timerComponent = TimerComponent();
            localState.cleanupFunctions.push(gridComponent.cleanup, resultPanelComponent.unsubscribe, timerComponent.cleanup, settingsComponent.cleanup || (() => {}));

            element.append(settingsComponent.element, resultPanelComponent.element, timerComponent.element, timerComponent.element, gridComponent.element);
            break;
        }
        case GAME_STATUS.LOSE:
            const loseComponent = LoseComponent();
            element.append(loseComponent.element);
            break;
        case GAME_STATUS.WIN:
            const winComponent = WinComponent();
            element.append(winComponent.element);       
            break;
        default: throw new Error('not implemented');
    }

    
}