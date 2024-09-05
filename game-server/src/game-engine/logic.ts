import { 
  ScoreboardContainer
} from "./types";

export const MAX_BALLS = 30;
export const MAX_WICKETS = 3;


//20% chance of a no-ball
export function isNoBall() {
  return Math.random() < 0.20;
}

export function processBall(
  prevScoreboard: ScoreboardContainer, 
  batterMove: number, 
  bowlerMove: number, 
  noBall: boolean): ScoreboardContainer {

  let newScoreboard = structuredClone(prevScoreboard);
  newScoreboard.last6.shift();

  if (noBall) {
    if (batterMove === bowlerMove) {
      newScoreboard.runs += 1;
      newScoreboard.last6.push("1nb");      
    } else {
      newScoreboard.runs += batterMove + 1;
      newScoreboard.last6.push(`${batterMove+1}nb`);
    }
  } else {
    newScoreboard.balls += 1;
    if (batterMove === bowlerMove) {
      newScoreboard.wickets += 1;
      newScoreboard.last6.push("w");
    } else {
      newScoreboard.runs += batterMove;
      newScoreboard.last6.push(`${batterMove}`);
    }
  }

  return newScoreboard;
}

export function endOfInnings(scoreboard: ScoreboardContainer): "innings1" | "innings2" | null {
  if (scoreboard.target) {
    let conditionBalls = scoreboard.balls === MAX_BALLS;
    let conditionWickets = scoreboard.wickets === MAX_WICKETS;
    let conditionRuns = scoreboard.runs >= scoreboard.target;

    if (conditionBalls || conditionWickets || conditionRuns) {
      return "innings2";
    } else {
      return null;
    }      
  } else {
    let conditionBalls = scoreboard.balls === MAX_BALLS;
    let conditionWickets = scoreboard.wickets === MAX_WICKETS;
    if (conditionBalls || conditionWickets) {
      return "innings1";
    } else {
      return null;
   }
  }
}

//Called only at the end of a second innings when a target has been set
export function winningStatement(
  scoreboard: ScoreboardContainer,
  batterUsername: string, 
  bowlerUsername: string): string {

  if(scoreboard.runs >= scoreboard.target!) {
    let wicketsRemaining = MAX_WICKETS - scoreboard.wickets;
    let wicketsStatement;
    if (wicketsRemaining !== 1) {
      wicketsStatement = `${wicketsRemaining} wickets`;
    } else {
      wicketsStatement = `${wicketsRemaining} wicket`; 
    }

    let ballsRemaining = MAX_BALLS - scoreboard.balls;
    let ballsStatement;
    if (ballsRemaining !== 1) {
      ballsStatement = `${ballsRemaining} balls left`;
    } else {
      ballsStatement = `${ballsRemaining} ball left`;
    }

    return `${batterUsername} has won by ${wicketsStatement} (with ${ballsStatement}).`;
  } else if (scoreboard.runs < (scoreboard.target! - 1)) {
    let runsRemaining = scoreboard.target! - 1 - scoreboard.runs;
    let runsStatement;
    if (runsRemaining !== 1) {
      runsStatement = `${runsRemaining} runs`;
    } else {
      runsStatement = `${runsRemaining} run`;
    }

    return `${bowlerUsername} has won by ${runsStatement}.`;
  } else {
    if (scoreboard.runs !== 1) {
      return `The match has been tied with both players scoring ${scoreboard.runs} runs.`
    } else {
      return `The match has been tied with both players scoring ${scoreboard.runs} run.` 
    }
  }
}
