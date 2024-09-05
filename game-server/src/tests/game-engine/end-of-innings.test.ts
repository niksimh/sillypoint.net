import { endOfInnings, MAX_BALLS, MAX_WICKETS } from "../../game-engine/logic";
import { ScoreboardContainer } from "../../game-engine/types";

test("End of innings 1 due to balls", () => {
  let scoreboard: ScoreboardContainer = {
    runs: 0,
    balls: MAX_BALLS,
    wickets: 0,
    last6: ["1","2","3","4","5","6"],
    target: null
  }

  let rightResult = "innings1";

  expect(endOfInnings(scoreboard)).toEqual(rightResult);
});

test("End of innings 1 due to wickets", () => {
  let scoreboard: ScoreboardContainer = {
    runs: 0,
    balls: 0,
    wickets: MAX_WICKETS,
    last6: ["1","2","3","4","5","6"],
    target: null
  }

  let rightResult = "innings1";

  expect(endOfInnings(scoreboard)).toEqual(rightResult);
});

test("Continuation of innings 1", () => {
  let scoreboard: ScoreboardContainer = {
    runs: 5,
    balls: 29,
    wickets: 2,
    last6: ["1","2","3","4","5","6"],
    target: null
  }

  let rightResult = null;

  expect(endOfInnings(scoreboard)).toEqual(rightResult);
});

test("End of innings 2 due to balls", () => {
  let scoreboard: ScoreboardContainer = {
    runs: 0,
    balls: MAX_BALLS,
    wickets: 0,
    last6: ["1","2","3","4","5","6"],
    target: 50
  }

  let rightResult = "innings2";

  expect(endOfInnings(scoreboard)).toEqual(rightResult);
});

test("End of innings 2 due to wickets", () => {
  let scoreboard: ScoreboardContainer = {
    runs: 0,
    balls: 0,
    wickets: MAX_WICKETS,
    last6: ["1","2","3","4","5","6"],
    target: 50
  }

  let rightResult = "innings2";

  expect(endOfInnings(scoreboard)).toEqual(rightResult);
});

test("End of innings 2 due to runs when runs equals target", () => {
  let scoreboard: ScoreboardContainer = {
    runs: 50,
    balls: 20,
    wickets: 2,
    last6: ["1","2","3","4","5","6"],
    target: 50
  }

  let rightResult = "innings2";

  expect(endOfInnings(scoreboard)).toEqual(rightResult);
});

test("End of innings 2 due to runs when runs is greater than target", () => {
  let scoreboard: ScoreboardContainer = {
    runs: 51,
    balls: 2,
    wickets: 2,
    last6: ["1","2","3","4","5","6"],
    target: 50
  }

  let rightResult = "innings2";

  expect(endOfInnings(scoreboard)).toEqual(rightResult);
});

test("Continuation of innings 2", () => {
  let scoreboard: ScoreboardContainer = {
    runs: 5,
    balls: 29,
    wickets: 2,
    last6: ["1","2","3","4","5","6"],
    target: 50
  }

  let rightResult = null;

  expect(endOfInnings(scoreboard)).toEqual(rightResult);
});
