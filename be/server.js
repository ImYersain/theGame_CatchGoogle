import express from 'express';
import cors from 'cors';
import { _getGameStatus, getGooglePosition, getGoogleScore, getGridSize, getPlayerScore, getPlayersPosition, getSettings, movePlayer, restartGame, startGame, stopGame, subscribe, unsubscribe } from '../core/state-manager-server.js';

const app = express();
app.use(cors());
const PORT = 3000;

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const observer = (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    subscribe(observer); 
    
    req.on('close', () => {
        unsubscribe(observer);
    })
})

app.get('/startGame', async (req, res) => {
    await startGame();
    res.send(200);
});

app.get('/restartGame', async (req, res) => {
    await restartGame();
    res.send(200);
});

app.get('/stopGame', async (req, res) => {
    await stopGame();
    res.send(200);
});

app.get('/movePlayer', async (req, res) => {
    await movePlayer(req.query.playerNumber, req.query.direction);
    res.send(200);
});

app.get('/getGoogleScore', async (req, res) => {
    const googleScore = await getGoogleScore();
    res.send({data: googleScore});
});

app.get('/getPlayerScore', async (req, res) => {
    const playerScore = await getPlayerScore(req.query.playerNumber);
    res.send({data: playerScore});
});

app.get('/getGridSize', async (req, res) => {
    const gridSize = await getGridSize();
    res.send({data: gridSize});
});

app.get('/getGameStatus', async (req, res) => {
    const gameStatus = await _getGameStatus();
    res.send({data: gameStatus});
});

app.get('/getGooglePosition', async (req, res) => {
    const googlePosition = await getGooglePosition();
    res.send({data: googlePosition});
});

app.get('/getPlayersPosition', async (req, res) => {
    const playersPosition = await getPlayersPosition(req.query.playerNumber);
    res.send({data: playersPosition});
});

app.get('/getSettings', async (req, res) => {
    const settings = await getSettings();
    res.send({data: settings});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});