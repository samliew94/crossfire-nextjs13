import Player from "@/models/player";
import { findAllPlayers, findSpectators } from "./playerservice";
import { Screen } from "@/enums/screen";

export function getLobbyData() {
  const players = findAllPlayers();

  const resMap = new Map<Player, any>();

  players.forEach((player) => {
    const map = {
      screen: Screen.LOBBY,
      host: player.host,
      players,
    };

    resMap.set(player, map);
  });

  return resMap;
}
