import Player from "@/models/player";
import { findAllPlayers } from "./playerservice";
import { Screen } from "@/enums/screen";
import {
  findFirstDrawCodeByPlayer,
  findSecondDrawCodeByPlayer,
  getShuffles,
  shuffledWithsByPlayer,
} from "./shuffleservice";
import { getSecondsRemaining } from "./timerservice";
import { getSelectedSetupRoles } from "./setupservice";

export function getIdentityData() {
  const resMap = new Map<Player, any>();

  findAllPlayers().forEach((player) => {
    const data = {
      screen: Screen.IDENTITY,
      host: player.host,
      roles: getSelectedSetupRoles(),
      shuffles: getShuffles(),
      timeRemaining: getSecondsRemaining(),
      firstDraw: findFirstDrawCodeByPlayer(player),
      secondDraw: findSecondDrawCodeByPlayer(player),
      withs: shuffledWithsByPlayer(player),
    };

    resMap.set(player, data);
  });

  return resMap;
}
