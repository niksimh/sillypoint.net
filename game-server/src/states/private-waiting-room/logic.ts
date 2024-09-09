import { JoinResult, KickResult, LeaveResult, RejoinResult, StartGameResult, WaitingRoom } from "./types";

export function leaveLogic(
  waitingRooms: Map<number, WaitingRoom>, 
  playerToWaitingRoom: Map<string, number>, 
  playerId: string): LeaveResult {

  if (!playerToWaitingRoom.has(playerId)) {
    return { decision: "leaveNotPresent" }
  }

  let currWaitingRoom = waitingRooms.get(playerToWaitingRoom.get(playerId)!)!;

  if(currWaitingRoom.creatorId === playerId) {
    if (currWaitingRoom.joinerId === null) {
      return { decision: "leaveCreatorNoJoiner" }
    } 
    return { decision: "leaveCreatorJoiner" };
  } 

  return { decision: "leaveJoiner" }; 
}

export function joinLogic(
  waitingRooms: Map<number, WaitingRoom>,
  playerToWaitingRoom: Map<string, number>,
  playerId: string, 
  input: string):  JoinResult {
    
    if (playerToWaitingRoom.has(playerId)) {
      return { decision: "present" };
    }

    let RoomId = Number(input);
    if (Number.isNaN(RoomId)) {
      return { decision: "badInput" };
    }

    let currWaitingRoom = waitingRooms.get(RoomId);
    if (currWaitingRoom === undefined) {
      return { decision: "badRoom" };
    }
    if(currWaitingRoom.joinerId !== null) {
      return { decision: "fullRoom" };
    }
    
    return { decision: "succesful" };
  }

export function kickLogic(
  waitingRooms: Map<number, WaitingRoom>,
  playerToWaitingRoom: Map<string, number>,
  playerId: string,
  ): KickResult {

    if (!playerToWaitingRoom.has(playerId)) {
      return { decision: "notPresent" };
    }

    let waitingRoom = waitingRooms.get(playerToWaitingRoom.get(playerId)!)!;

    if (waitingRoom.joinerId === playerId) {
      return { decision: "notCreator" };
    }

    if (waitingRoom.joinerId === null) {
      return { decision: "empty" };
    }

    return { decision: "successful" };
  }

export function startGameLogic(
  waitingRooms: Map<number, WaitingRoom>,
  playerToWaitingRoom: Map<string, number>,
  playerId: string,
  ): StartGameResult {
  
    if (!playerToWaitingRoom.has(playerId)) {
      return { decision: "notPresent" };
    }

    let waitingRoom = waitingRooms.get(playerToWaitingRoom.get(playerId)!)!;

    if (waitingRoom.joinerId === playerId) {
      return { decision: "notCreator" };
    }

    if (waitingRoom.joinerId === null) {
      return { decision: "noJoiner" };
    }

    return { decision: "successful" };
  }

export function rejoinLogic(
  waitingRooms: Map<number, WaitingRoom>,
  playerToWaitingRoom: Map<string, number>,
  playerId: string,
): RejoinResult {
  
  if (!playerToWaitingRoom.has(playerId)) {
    return { decision: "joinerNotJoined" };
  }

  let waitingRoom = waitingRooms.get(playerToWaitingRoom.get(playerId)!)!;

  if (waitingRoom.creatorId === playerId) {
    if (waitingRoom.joinerId) {
      return { decision: "creatorJoiner" };
    }
    return { decision: "creatorNoJoiner" };
  }

  return { decision: "joinerJoined" };
}