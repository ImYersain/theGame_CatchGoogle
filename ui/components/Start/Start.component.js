import { startGame } from "../../../core/state-manager.js";

export function StartButtonComponent() {
    const element = document.createElement('div');
   
    render(element);

    return {element}
}

async function render(element) {
    const button = document.createElement('button');
    button.addEventListener('click', startGame);
    button.append('Start game');

    element.append(button);
}