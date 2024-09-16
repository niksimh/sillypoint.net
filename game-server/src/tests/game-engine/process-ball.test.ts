import { processBall } from "@/game-engine/logic";
import { ScoreboardContainer } from "@/game-engine/types";

test("Process ball during no-ball when batter and bowler have the same move", () => {
  let scoreboard: ScoreboardContainer = {
    batterId: "pId1",
    runs: 0,
    balls: 0,
    wickets: 0,
    last6: ["1","2","3","4","5","6"],
    target: null
  };

  let rightResult = {
    batterId: "pId1",
    runs: 1,
    balls: 0,
    wickets: 0,
    last6: ["2","3","4","5","6","1nb"],
    target: null
  };

  expect(processBall(scoreboard, 3, 3, true)).toEqual(rightResult);
});

test("Process ball during no-ball when batter and bowler have different moves", () => {
  let scoreboard: ScoreboardContainer = {
    batterId: "pId1",
    runs: 0,
    balls: 0,
    wickets: 0,
    last6: ["1","2","3","4","5","6"],
    target: null
  };

  let rightResult = {
    batterId: "pId1",
    runs: 7,
    balls: 0,
    wickets: 0,
    last6: ["2","3","4","5","6","7nb"],
    target: null
  };

  expect(processBall(scoreboard, 6, 3, true)).toEqual(rightResult);
});

test("Process ball during valid ball when batter and bowler have the same move", () => {
  let scoreboard: ScoreboardContainer = {
    batterId: "pId1",
    runs: 0,
    balls: 0,
    wickets: 0,
    last6: ["1","2","3","4","5","6"],
    target: null
  };

  let rightResult = {
    batterId: "pId1",
    runs: 0,
    balls: 1,
    wickets: 1,
    last6: ["2","3","4","5","6","w"],
    target: null
  };

  expect(processBall(scoreboard, 3, 3, false)).toEqual(rightResult);
});

test("Process ball during valid ball when batter and bowler have different moves", () => {
  let scoreboard: ScoreboardContainer = {
    batterId: "pId1",
    runs: 0,
    balls: 0,
    wickets: 0,
    last6: ["1","2","3","4","5","6"],
    target: null
  };

  let rightResult = {
    batterId: "pId1",
    runs: 6,
    balls: 1,
    wickets: 0,
    last6: ["2","3","4","5","6","6"],
    target: null
  };

  expect(processBall(scoreboard, 6, 3, false)).toEqual(rightResult);
});
