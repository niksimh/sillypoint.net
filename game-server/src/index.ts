import express from "express";
import qs from "qs";
import cors from "cors";
import checkIn from "./http-handlers/check-in";
import crypto from "crypto";
import register from "./http-handlers/register";
import { WebSocketServer } from 'ws';

const app = express();
const port = 4000;

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

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', function connection(ws, request) {  
  ws.send('something');
});

server.on('upgrade', function upgrade(request, socket, head) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    }
  )
});
