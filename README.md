# sillypoint.net
sillypoint is an online multiplayer game based on the sport of cricket and the hand game of "hand cricket." Visit [sillypoint.net](https://sillypoint.net) to play. It is recommended you check out the rules page there before proceeding here as understanding the game helps with understanding how it was written. 

## Game Server
The backend is written in TypeScript, utilizing Express for HTTP requests and WebSockets for bi-directional communication between the game client and game server. As much as possible, the "functional core, imperative shell" design pattern is used.

There are two main endpoints for requests not associated with the actual gameplay-- `/check-in` and `/register`. `/check-in` is the first communication that the client has with the game server. For now, the game server just routes the player to `/register`, but in the future the intention is for this endpoint to handle initial analytics and to determine identity for user accounts. `/register` allows players to enter the game with a username. The endpoint returns a JWT that is used to track the player throughout the course of the game as well as to handle disconnects.

In order to manage sockets and players, the game server features a relay service and a player database. All socket I/O comes in and out through the relay service, so it acts as a middle man between gameplay logic and the web client. The player database keeps track of where the player is with respect to gameplay as well as their connection status. As a result of the player database, when there is a network connection change or some other event that causes a socket disconnect, players can refresh and rejoin the game. The game server does not allow the same player (where a JWT identifies a player) to have two connections to the server -- the second connection will disconnect. The JWT is stored in localStorage, so the same browser can't be used for two simultaneous sessions -- a new browser is needed.

Gameplay is formulized as a state machine, handling the initial connection after registering all the way to an end-game/end-connection state. Understanding the game makes understanding the flow of this logic intuitive. 

## Web Client
The web client uses the Next.js framework, utilizing TypeScript and React. There is a route for `/`, `/rules`, `/register`, and `/game`. `/` handles the initial check-in as well as provding the option to see the rules page or continue with registering. `/rules` is self-explanatory -- it features the rules. `/register` provides the interface to create a username and to obtain the JWT. And lastly, within `/game`, the socket connection is made. There are sub-states rendered at this endpoint corresponding to the gameplay state machine, which sends output as needed to progress the game. 

## Deployment
The game server is at game-server.sillypoint.net and the web client is at sillypoint.net, so they are separate processes. They are run on Fargate/EC2 in containers, with an ALB fronting them. The build script in `/game-server` builds and starts the game server. The build and start scripts in `/web-client` starts the web-client. 
