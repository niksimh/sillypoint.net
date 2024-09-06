import { winningStatement, MAX_BALLS, MAX_WICKETS } from "../../game-engine/logic";
import { ScoreboardContainer } from "../../game-engine/types";

test("Winning statement with batter winning with 1 wicket and 1 ball left", () => {
  let scoreboard: ScoreboardContainer = {
    batterId: "pId1",
    runs: 11,
    balls: MAX_BALLS - 1,
    wickets: MAX_WICKETS - 1,
    last6: ["1","2","3","4","5","6"],
    target: 10
  }
  
  let rightResult = "p1 has won by 1 wicket (with 1 ball left)."

  expect(winningStatement(scoreboard, "p1", "p2")).toEqual(rightResult);
});

test("Winning statement with batter winning with multiple wickets and multiple balls left", () => {
  let scoreboard: ScoreboardContainer = {
    batterId: "pId1",
    runs: 11,
    balls: MAX_BALLS - 2,
    wickets: MAX_WICKETS - 2,
    last6: ["1","2","3","4","5","6"],
    target: 10
  };

  let rightResult = "p1 has won by 2 wickets (with 2 balls left)."

  expect(winningStatement(scoreboard, "p1", "p2")).toEqual(rightResult);
});

test("Winning statement with bowler winning by 1 run", () => {
  let scoreboard: ScoreboardContainer = {
    batterId: "pId1",
    runs: 8,
    balls: MAX_BALLS,
    wickets: MAX_WICKETS - 2,
    last6: ["1","2","3","4","5","6"],
    target: 10
  };

  let rightResult = "p2 has won by 1 run.";

  expect(winningStatement(scoreboard, "p1", "p2")).toEqual(rightResult);
});

test("Winning statement with bowler winning by multiple runs", () => {
  let scoreboard: ScoreboardContainer = {
    batterId: "pId1",
    runs: 7,
    balls: MAX_BALLS,
    wickets: MAX_WICKETS - 2,
    last6: ["1","2","3","4","5","6"],
    target: 10
  };

  let rightResult = "p2 has won by 2 runs.";

  expect(winningStatement(scoreboard, "p1", "p2")).toEqual(rightResult);
});

test("Test tie with 1 run scored by both players", () => {
  let scoreboard: ScoreboardContainer= {
    batterId: "pId1",
    runs: 1,
    balls: MAX_BALLS,
    wickets: MAX_WICKETS - 2,
    last6: ["1","2","3","4","5","6"],
    target: 2
  };

  let rightResult = "The match has been tied with both players scoring 1 run.";

  expect(winningStatement(scoreboard, "p1", "p2")).toEqual(rightResult);
});

test("Test tie with multiple runs scored by both players", () => {
  let scoreboard: ScoreboardContainer = {
    batterId: "pId1",
    runs: 14,
    balls: MAX_BALLS,
    wickets: MAX_WICKETS - 2,
    last6: ["1","2","3","4","5","6"],
    target: 15
  };

  let rightResult = "The match has been tied with both players scoring 14 runs.";
  
  expect(winningStatement(scoreboard, "p1", "p2")).toEqual(rightResult);
});
