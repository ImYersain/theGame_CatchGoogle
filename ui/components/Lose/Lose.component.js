import { restartGame } from "../../../core/state-manager.js";

export function LoseComponent() {
    const element = document.createElement('div');
    render(element);

    return {element}
}

async function render(element) {
    const button = document.createElement('button');
    const titleElement = document.createElement('h1');
    
    button.addEventListener('click', restartGame);
    button.append('Restart game');
    
    titleElement.append(`You lose, Google wins :)`);

    element.append(titleElement);
    element.append(button);
}