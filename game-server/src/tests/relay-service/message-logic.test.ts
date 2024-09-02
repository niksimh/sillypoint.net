import { messageLogic } from "../../relay-service/logic";
import { MessageLeaveResult, MessageHandleResult } from "../../relay-service/types";

test("Handle message with non-JSON format", () => {
  let message = "badMessage";

  let rightResult: MessageLeaveResult = {
    decision: "leave"
  };

  expect(messageLogic(0, message)).toEqual(rightResult);
})

test("Handle message that is JSON-formatted but not following the defined shape", () => {
  let message = {
    bad: "schema"
  };

  let rightResult: MessageLeaveResult = {
    decision: "leave"
  };

  expect(messageLogic(0, JSON.stringify(message))).toEqual(rightResult);
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

  expect(messageLogic(0, JSON.stringify(message))).toEqual(rightResult);
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

  expect(messageLogic(123, JSON.stringify(message))).toEqual(rightResult);
})
