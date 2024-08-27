import { Player } from "./types";

export default class PlayerDB {
  playerMap: Map<string, Player>

  constructor() {
    this.playerMap = new Map();
  }

  addPlayer(playerId: string, newPlayer: Player) {
    if(this.playerMap.has(playerId)) {
      return;
    }   
    
    this.playerMap.set(playerId, newPlayer);
  }

  getPlayer(playerId: string) {
    return this.playerMap.get(playerId);
  }

  hasPlayer(playerId: string) {
    return this.playerMap.has(playerId);
  }

  removePlayer(playerId: string) {
    this.playerMap.delete(playerId);
  }

}
