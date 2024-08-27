import express from "express";
import qs from "qs";
import cors from "cors";
import crypto from "crypto";
import { WebSocketServer } from 'ws';

import checkIn from "./index-handlers/check-in";
import register from "./index-handlers/register";
import setupStates from "./states/setup-states";
import PlayerDB from "./player-db/player-db";
import type { State } from "./states/types";
import RelayService from "./relay-service/relay-service";

//Setup
const app = express();
const wss = new WebSocketServer({ noServer: true });
const port = 4000;

let playerDB = new PlayerDB();
let stateMap = new Map<string, State>();
let relayService = new RelayService(wss, stateMap, playerDB);

setupStates(stateMap, playerDB, relayService);

app.set("query parameter", (str: string) => {
  qs.parse(str);
})

//Express
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

//WebSocket Server
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
