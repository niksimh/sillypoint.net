import express from "express";
import qs from "qs";
import cors from "cors";
import checkIn from "./http-handlers/check-in";
import crypto from "crypto";
import register from "./http-handlers/register";
import { WebSocketServer } from 'ws';
import PlayerDB from "./player-db/player-db";
import type { State } from "./states/types";
import Connecting from "./states/connecting";
import GameSelection from "./states/game-selection";
import PublicWaitingRoom from "./states/public-waiting-room";
import PrivateWaitingRoom from "./states/private-waiting-room";
import Lobby from "./states/lobby";
import Toss from "./states/toss";
import TossWinnerSelection from "./states/toss-winner-selection";
import Innings1 from "./states/innings-1";
import InningsBreak from "./states/innings-break";
import Innings2 from "./states/innings-2";
import GameOver from "./states/game-over";
import RelayService from "./relay-service/relay-service";

const app = express();
const wss = new WebSocketServer({ noServer: true });
const port = 4000;

let playerDB = new PlayerDB();
let stateMap = new Map<string, State>();
let relayService = new RelayService(wss, stateMap, playerDB);

let connectingState = new Connecting(stateMap, playerDB);
stateMap.set("connecting", connectingState); 

let gameSelectionState = new GameSelection(stateMap, playerDB, relayService);
stateMap.set("gameSelection", gameSelectionState);

let publicWaitingRoomState = new PublicWaitingRoom(stateMap, playerDB);
stateMap.set("publicWaitingRoom", publicWaitingRoomState);

let privateWaitingRoomState= new PrivateWaitingRoom(stateMap, playerDB);
stateMap.set("privateWaitingRoom", privateWaitingRoomState);

let lobbyState = new Lobby(stateMap, playerDB);
stateMap.set("lobby", lobbyState);

let tossState = new Toss(stateMap, playerDB);
stateMap.set("tossState", tossState);

let tossWinnerSelectionState = new TossWinnerSelection(stateMap, playerDB);
stateMap.set("tossWinnerSelection", tossWinnerSelectionState);

let innings1State = new Innings1(stateMap, playerDB);
stateMap.set("innings1", innings1State);

let inningsBreakState = new InningsBreak(stateMap, playerDB);
stateMap.set("inningsBreak", inningsBreakState);

let innings2State = new Innings2(stateMap, playerDB);
stateMap.set("innings2", innings2State);

let gameOverState = new GameOver(stateMap, playerDB);
stateMap.set("gameOver", gameOverState);

app.set("query parameter", (str: string) => {
  qs.parse(str);
})

app.get('/', cors(), (req, res) => {
  res.send('Hello World!');
})

app.get('/check-in', cors(), (req, res) => {
  let direction = checkIn(req.query);
  res.json(direction);
})

app.get('/register', cors(), (req, res) => {
  let id = crypto.randomUUID();
  let randomNumber = crypto.randomInt(9999);
  
  let registrationResult = register(req.query.username as string, id, randomNumber, process.env.playerIdTokenSecret!);
  
  res.json(registrationResult);
})

let server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

wss.on('connection', function connection(ws, request) {  
  relayService.connectionHandler(ws, request);

  ws.send('something');
});

server.on('upgrade', function upgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    }
  )
});
