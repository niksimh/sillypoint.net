import { JoinResult, KickResult, LeaveResult, StartGameResult, WaitingNode } from "./types";

export function leaveLogic(
  waitingRooms: Map<number, WaitingNode>, 
  playerToWaitingRoom: Map<string, number>, 
  playerId: string): LeaveResult {

  if (!playerToWaitingRoom.has(playerId)) {
    return { decision: "leaveNotPresent" }
  }

  let currWaitingNode = waitingRooms.get(playerToWaitingRoom.get(playerId)!)!;

  if(currWaitingNode.creatorId === playerId) {
    if (currWaitingNode.joinerId === undefined) {
      return { decision: "leaveCreatorNoJoiner" }
    } 
    return { decision: "leaveCreatorJoiner" };
  } 

  return { decision: "leaveJoiner" }; 
}

export function joinLogic(
  waitingRooms: Map<number, WaitingNode>,
  playerToWaitingRoom: Map<string, number>,
  playerId: string, 
  input: string):  JoinResult {
    
    if (playerToWaitingRoom.has(playerId)) {
      return { decision: "present" };
    }

    let roomId = Number(input);
    if (Number.isNaN(roomId)) {
      return { decision: "badInput" };
    }

    let currWaitingNode = waitingRooms.get(roomId);
    if (currWaitingNode === undefined) {
      return { decision: "badRoom" };
    }
    if(currWaitingNode.joinerId !== undefined) {
      return { decision: "fullRoom" };
    }
    
    return { decision: "succesful" };
  }

export function kickLogic(
  waitingRooms: Map<number, WaitingNode>,
  playerToWaitingRoom: Map<string, number>,
  playerId: string,
  ): KickResult {

    if (!playerToWaitingRoom.has(playerId)) {
      return { decision: "notPresent" };
    }

    let waitingNode = waitingRooms.get(playerToWaitingRoom.get(playerId)!)!;

    if (waitingNode.joinerId === playerId) {
      return { decision: "notCreator" };
    }

    if (waitingNode.joinerId === undefined) {
      return { decision: "empty" };
    }

    return { decision: "successful" };
  }

export function startGameLogic(
  waitingRooms: Map<number, WaitingNode>,
  playerToWaitingRoom: Map<string, number>,
  playerId: string,
  ): StartGameResult {
  
    if (!playerToWaitingRoom.has(playerId)) {
      return { decision: "notPresent" };
    }

    let waitingNode = waitingRooms.get(playerToWaitingRoom.get(playerId)!)!;

    if (waitingNode.joinerId === playerId) {
      return { decision: "notCreator" };
    }

    if (waitingNode.joinerId === undefined) {
      return { decision: "noJoiner" };
    }

    return { decision: "successful" };
  }
