import { EVENTS } from "../../../../core/constants.js";
import { getGooglePosition, getPlayersPosition, subscribe, unsubscribe } from "../../../../core/state-manager.js";
import { GoogleComponent } from "../../common/Google/Google.component.js";
import { PlayerComponent } from "../../common/Player/Player.component.js";

export function CellComponent(x, y) {
    const element = document.createElement('td');
    const localState = {rendering: false};
    
    let observer = (e) => {
        if([EVENTS.GOOGLE_JUMPED, EVENTS.PLAYER1_MOVED, EVENTS.PLAYER2_MOVED].every(name => name !== e.name)) return;

        const prev = e.payload && (e.payload.prevPosition || e.payload.oldPosition);
        const next = e.payload && (e.payload.newPosition || e.payload.newPosition);

        if(prev && prev.x === x && prev.y === y) {
            render(element, x, y, localState);
        }

        if(next && next.x === x && next.y === y) {
            render(element, x, y, localState);
        }
    };

    subscribe(observer);
    
    render(element, x, y, localState);
    return {element, cleanup: () => unsubscribe(observer)};
}

async function render(element, x, y, localState) {
    if(localState.rendering) return;

    localState.rendering = true;
    element.innerHTML = '';

    const googlePosition = await getGooglePosition();
    const player1Position = await getPlayersPosition(1);
    const player2Position = await getPlayersPosition(2);

    if(googlePosition.x === x && googlePosition.y === y) {
        element.append(GoogleComponent().element);
    }

    if(player1Position.x === x && player1Position.y === y) {
        element.append(PlayerComponent(1).element);
    }

    if(player2Position.x === x && player2Position.y === y) {
        element.append(PlayerComponent(2).element);
    }

    localState.rendering = false;
}