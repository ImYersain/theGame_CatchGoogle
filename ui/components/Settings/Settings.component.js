import { changeSettingsGridSize, changeSettingsHandleSound, changeSettingsPointsToLose, changeSettingsPointsToWin, getSettings } from "../../../core/state-manager.js";

import { subscribe, unsubscribe, _getGameStatus } from "../../../core/state-manager.js";
import { GAME_STATUS } from "../../../core/constants.js";

export function SettingsComponent() {
  const element = document.createElement('div');
  element.classList.add('settings-panel');
  let observer = null;
    
  render(element);

  return {element, cleanup: () => {
    if(observer) unsubscribe(observer);
  }}
}

async function render(element) {
     element.innerHTML = `
      <h3 class="settings-title">Settings</h3>
      <form class="settings-form" autocomplete="off">
        <div class="form-row">
          <label for="grid-size">Grid Size</label>
          <select id="grid-size" name="grid-size" class="input">
            <option value="5">5 x 5</option>
            <option value="10">10 x 10</option>
            <option value="15">15 x 15</option>
          </select>
        </div>

        <div class="form-row">
          <label for="points-to-win">Points to Win</label>
          <select id="points-to-win" name="points-to-win" class="input">
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="form-row">
          <label for="points-to-lose">Points to Lose</label>
          <select id="points-to-lose" name="points-to-lose" class="input">
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="form-row toggle-row">
          <label for="sound-toggle">Sound</label>
          <div class="toggle">
            <input type="checkbox" id="sound-toggle" />
            <label for="sound-toggle" class="toggle-visual" aria-hidden></label>
          </div>
        </div>
      </form>
    `;

    const selectGridSize = element.querySelector('#grid-size');
    selectGridSize.addEventListener('change', (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    if (!Number.isNaN(selectedValue)) {
        changeSettingsGridSize(selectedValue, selectedValue);
    }
    });

    const selectPointsToWin = element.querySelector('#points-to-win');
    selectPointsToWin.addEventListener('change', (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    if (!Number.isNaN(selectedValue)) changeSettingsPointsToWin(selectedValue);
    });

    const selectPointsToLose = element.querySelector('#points-to-lose');
    selectPointsToLose.addEventListener('change', (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    if (!Number.isNaN(selectedValue)) changeSettingsPointsToLose(selectedValue);
    });

    const soundsToggle = element.querySelector('#sound-toggle');
    soundsToggle.addEventListener('change', (event) => {
    const selectedValue = event.target.checked;
    changeSettingsHandleSound(!!selectedValue);
    });
        
    const setDisabled = (disabled) => {
      const controls = element.querySelectorAll('select');
      controls.forEach((c) => c.disabled = disabled);
      if(disabled) element.classList.add('settings-disabled'); else element.classList.remove('settings-disabled');
    }

    try {
      const status = await _getGameStatus();
      setDisabled(status === GAME_STATUS.IN_PROGRESS);
    } catch (err) {
      console.warn('Failed to get game status on settings init', err);
    }

    try {
        const settings = await getSettings();
        if(settings && settings.gridSize) {
            const n = settings.gridSize.columnsCount;
            const opt = element.querySelector(`#grid-size option[value="${n}"]`);
            if(opt) opt.selected = true;
        }

        const pWinOpt = element.querySelector(`#points-to-win option[value="${settings.pointsToWin}"]`);
        if(pWinOpt) pWinOpt.selected = true;

        const pLoseOpt = element.querySelector(`#points-to-lose option[value="${settings.pointsToLose}"]`);
        if(pLoseOpt) pLoseOpt.selected = true;

        const soundsToggleEl = element.querySelector('#sound-toggle');
        if(soundsToggleEl) soundsToggleEl.checked = !!settings.soundsEnabled;
    } catch (err) {
        console.warn('Failed to get settings on settings init', err);
    }

    observer = (e) => {
      if(e.name === EVENTS.SETTINGS_CHANGED) {
        _getGameStatus().then((status) => {
          setDisabled(status === GAME_STATUS.IN_PROGRESS);
        }).catch(() => {});
      }
    };

    subscribe(observer);
}