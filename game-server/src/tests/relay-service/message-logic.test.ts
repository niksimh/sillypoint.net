import { messageLogic } from "../../relay-service/logic";

test("Handle message with non-JSON format", () => {
  let message = "badMessage";
  expect(messageLogic(0, message)).toEqual({ decision: "leave" });
})

test("Handle message that is JSON-formatted but not following the defined shape", () => {
  let message = {
    bad: "schema"
  };
  expect(messageLogic(0, JSON.stringify(message))).toEqual({ decision: "leave" });
})

test("Handle message with bad seqNumber", () => {
  let message = {
    seqNum: 123, 
    type: "someInput",
    input: "5"
  };
  expect(messageLogic(0, JSON.stringify(message))).toEqual({ decision: "leave" });
})

test("Handle good message", () => {
  let message = {
    seqNum: 123, 
    type: "someInput",
    input: "5"
  };
  expect(messageLogic(123, JSON.stringify(message))).toEqual({ decision: "handle" });
})
