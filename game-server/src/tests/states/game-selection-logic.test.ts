import { inputHandlerLogic } from "../../states/game-selection/logic";

test("Non-JSOn input", () => {
  expect(inputHandlerLogic("hi")).toEqual({ decision: "ignore" });
})

test("Bad input scheme", () => {
  let input = {
    input: 1
  }
  expect(inputHandlerLogic(JSON.stringify(input))).toEqual({ decision: "ignore" });
})

test("Bad input type", () => {
  let input = {
    type: "badType",
    input: 1
  }
  expect(inputHandlerLogic(JSON.stringify(input))).toEqual({ decision: "ignore" });
})

test("Good game selection input", () => {
  let input = {
    type: "gameSelection",
    input: 1
  }
  expect(inputHandlerLogic(JSON.stringify(input))).toEqual({ 
    decision: "gameSelection",
    input: 1 
  });
})