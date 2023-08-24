import { Progress } from "../enums/progress";
import { Screen } from "../enums/screen";
import { getIdentityData } from "./identityservice";
import { getLobbyData } from "./lobbyservice";
import { getResultData } from "./resultservice";
import { getLatestSetupData } from "./setupservice";
import { getVoteData } from "./voteservice";

let progress: Progress = Progress.LOBBY;

export function resetGameService() {
  progress = Progress.LOBBY;
}

export function getProgress() {
  return progress;
}

export function getLatestData() {
  if (progress === Progress.LOBBY) {
    return getLobbyData();
  } else if (progress === Progress.SETUP) {
    return getLatestSetupData();
  } else if (progress === Progress.IDENTITY) {
    return getIdentityData();
  } else if (progress === Progress.VOTE) {
    return getVoteData();
  } else if (progress === Progress.RESULT) {
    return getResultData();
  } else {
    return {
      screen: Screen.PNF,
    };
  }
}

export function updateGameProgress(p: Progress) {
  console.log(`updating game progress to ${p}`);
  progress = p;
}
