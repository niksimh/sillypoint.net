import express from "express";
import qs from "qs";
import cors from "cors";
import crypto from "crypto";
import { WebSocketServer } from 'ws';

import checkIn from "@/index-handlers/check-in";
import register from "@/index-handlers/register";

import { State } from "@/states/types";
import setupStates from "@/states/setup-states";

import PlayerDB from "@/player-db/player-db";

import RelayService from "@/relay-service/relay-service";

//Setup
const app = express();
const wss = new WebSocketServer({ noServer: true });
const port = 4000;

let playerDB = new PlayerDB();
let stateMap = new Map<string, State>();
let relayService = new RelayService(wss, stateMap, playerDB);

setupStates(stateMap, playerDB, relayService);

//Express
app.set("query parameter", (str: string) => {
  qs.parse(str);
})

app.get('/check-in', cors(), (req, res) => {
  let result = checkIn();
  res.json(result);
});

app.get('/register', cors(), (req, res) => {
  let playerId = crypto.randomUUID();
  let randomNumber = crypto.randomInt(9999);
  let username = req.query.username as string | undefined;
  let registrationSecret = process.env.playerIdTokenSecret!;

  let result = register(username, playerId, randomNumber, registrationSecret);
  
  res.json(result);
})

let server = app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

//WebSocket Server
wss.on('connection', function connection(ws, request) {  
  relayService.connectionHandler(ws, request);
});

server.on('upgrade', function upgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    }
  )
});
