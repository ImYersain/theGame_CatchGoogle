import { EVENTS } from "../../../core/constants.js";
import { subscribe, getSettings } from "../../../core/state-manager.js";

export const AudioComponent = () => {
    const audioCatch = new Audio('assets/sounds/catch.wav');
    const audioMiss = new Audio('assets/sounds/miss.mp3');

    subscribe(async (e) => {
        try {
            const settings = await getSettings();
            if(!settings || !settings.soundsEnabled) return;
        } catch (err) {
            console.error('Error fetching settings for audio component:', err);
        }

        if(e.name === EVENTS.GOOGLE_CAUGHT) {
            audioCatch.currentTime = 0;
            audioCatch.play();
        }

        if(e.name === EVENTS.GOOGLE_RUNAWAY) {
            audioMiss.currentTime = 0
            audioMiss.play();
        }
    });
}