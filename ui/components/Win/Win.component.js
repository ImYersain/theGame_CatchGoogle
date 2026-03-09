import { getPlayerScore, restartGame } from "../../../core/state-manager.js";

export function WinComponent() {
    const element = document.createElement('div');
    render(element);

    return {element}
}

async function render(element) {
    const button = document.createElement('button');
    const titleElement = document.createElement('h1');

    const p1 = await getPlayerScore(1);
    const p2 = await getPlayerScore(2);
    
    const winnerPlayer = p1 > p2 ? 1 : 2;
    
    button.addEventListener('click', restartGame);
    button.append('Restart game');
    
    titleElement.append(`Player ${winnerPlayer} Wins!`);

    element.append(titleElement);
    element.append(button);
}