import { MOVING_DIRECTIONS } from "../../../core/constants.js";
import { getGridSize, movePlayer, stopGame } from "../../../core/state-manager.js";
import { CellComponent } from "./Cell/Cell.component.js";

export function GridComponent() {
    const element = document.createElement('table');
    element.classList.add('grid');
    const localState = {
        cleanupFunctions: []
    };
    
    const keyUpObserver = (e) => {
        console.log(e.code);
        switch (e.code) {
            case 'ArrowUp':
                movePlayer(1, MOVING_DIRECTIONS.UP)
                break;
            case 'ArrowDown':
                movePlayer(1, MOVING_DIRECTIONS.DOWN)
                break;
            case 'ArrowRight':
                movePlayer(1, MOVING_DIRECTIONS.RIGHT)
                break;
            case 'ArrowLeft':
                movePlayer(1, MOVING_DIRECTIONS.LEFT)
                break;
            
            case 'KeyW':
                movePlayer(2, MOVING_DIRECTIONS.UP)
                break;
            case 'KeyS':
                movePlayer(2, MOVING_DIRECTIONS.DOWN)
                break;
            case 'KeyD':
                movePlayer(2, MOVING_DIRECTIONS.RIGHT)
                break;
            case 'KeyA':
                movePlayer(2, MOVING_DIRECTIONS.LEFT)
                break;
            default:
                break;
        }
    };
    document.addEventListener('keyup', keyUpObserver);

    render(element, localState);

    return {element, cleanup: () => {
        localState.cleanupFunctions.forEach((f) => f());
        document.removeEventListener('keyup', keyUpObserver);
    }};
}

async function render(element, localState) {
    localState.cleanupFunctions.forEach((f) => f());
    localState.cleanupFunctions = [];

    element.innerHTML = '';
    const gridSizePromise = getGridSize();
    const gridSize = await gridSizePromise;

    for(let y = 0; y < gridSize.rowsCount; y++) {
        const rowElement = document.createElement('tr');

        for(let x = 0; x < gridSize.columnsCount; x++) {
            const cellComponent = CellComponent(x, y);
            localState.cleanupFunctions.push(cellComponent.cleanup);
            rowElement.append(cellComponent.element);
        }

        element.append(rowElement);
    }

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Stop Game';
    stopButton.addEventListener('click', async () => {
        await stopGame();
    });

    element.after(stopButton);
}