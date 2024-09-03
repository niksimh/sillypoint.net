import { messageLogic } from "../../relay-service/logic";
import { 
  MessageLeaveResult,
  MessageHandleResult,
  MessageIgnoreResult 
} from "../../relay-service/types";

const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

test("Handle message while socket is closing", () => {
  let message = {
    seqNum: 123, 
    inputContainer: {
      type: "someInput",
      input: "5"
    }
  };

  let rightResult: MessageIgnoreResult = {
    decision: "ignore"
  };

  expect(messageLogic(CLOSING, 123, JSON.stringify(message))).toEqual(rightResult);
})

test("Handle message when socket is closed", () => {
  let message = {
    seqNum: 123, 
    inputContainer: {
      type: "someInput",
      input: "5"
    }
  };

  let rightResult: MessageIgnoreResult = {
    decision: "ignore"
  };

  expect(messageLogic(CLOSED, 123, JSON.stringify(message))).toEqual(rightResult);
})

test("Handle message with non-JSON format", () => {
  let message = "badMessage";

  let rightResult: MessageLeaveResult = {
    decision: "leave"
  };

  expect(messageLogic(OPEN, 0, message)).toEqual(rightResult);
})

test("Handle message that is JSON-formatted but not following the defined shape", () => {
  let message = {
    bad: "schema"
  };

  let rightResult: MessageLeaveResult = {
    decision: "leave"
  };

  expect(messageLogic(OPEN, 0, JSON.stringify(message))).toEqual(rightResult);
})

test("Handle message with bad seqNumber", () => {
  let message = {
    seqNum: 123, 
    inputContainer: {
      type: "someInput",
      input: "5"
    }
  };

  let rightResult: MessageLeaveResult = {
    decision: "leave"
  };

  expect(messageLogic(OPEN, 0, JSON.stringify(message))).toEqual(rightResult);
})

test("Handle good message", () => {
  let message = {
    seqNum: 123, 
    inputContainer: {
      type: "someInput",
      input: "5"
    }
  };

  let rightResult: MessageHandleResult = {
    decision: "handle",
    parsedMessage: message
  };

  expect(messageLogic(OPEN, 123, JSON.stringify(message))).toEqual(rightResult);
})
