import Player from "@/models/player";
import { findAllPlayers } from "./playerservice";
import { Screen } from "@/enums/screen";
import { getVotes } from "./voteservice";
import { findPlayersByRole, getFinalRoleMap } from "./shuffleservice";

const shot: {
  player: Player;
  target: Player;
}[] = [];

const winnersAndLosers: {
  win: boolean;
  code: string;
  player: string;
}[] = [];

const deaths: Player[] = [];

const eventLogs: {
  shooter: string;
  shooterCode: string;
  target: string;
  targetCode: string;
}[] = [];

export function resetResult() {
  shot.length = 0;
  winnersAndLosers.length = 0;
  deaths.length = 0;
  eventLogs.length = 0;
}

export function getResultData() {
  const resMap = new Map<Player, any>();

  findAllPlayers().forEach((player) => {
    resMap.set(player, {
      screen: Screen.RESULT,
      host: player.host,
      winnersAndLosers,
      eventLogs,
    });
  });

  return resMap;
}

export function getWinnersAndLosers() {
  return winnersAndLosers;
}

export function determineWinners() {
  const votes = getVotes(); // who voted who?
  const finalRoleMap = getFinalRoleMap();

  const agents = findPlayersByRole("AGENT");
  agents.forEach((agent) => {
    const player = agent[0];
    const target = votes.find((x) => x.player === player)?.target;

    if (target) {
      deaths.push(target);
      eventLogs.push({
        shooter: player.username,
        shooterCode: finalRoleMap.get(player) ?? "",
        target: target.username,
        targetCode: finalRoleMap.get(target) ?? "",
      });
    }
  });

  const survivingAssassins = findPlayersByRole("ASSASSIN").filter(
    (x) => !deaths.includes(x[0])
  );

  survivingAssassins.forEach((assassin) => {
    const player = assassin[0];
    const target = votes.find((x) => x.player === player)?.target;

    if (target) {
      deaths.push(target);
      eventLogs.push({
        shooter: player.username,
        shooterCode: finalRoleMap.get(player) ?? "",
        target: target.username,
        targetCode: finalRoleMap.get(target) ?? "",
      });
    }
  });

  const vip = findPlayersByRole("VIP")[0][0];

  function addOrUpdateWinnersAndLosers(
    win: boolean,
    code: string,
    player: string
  ) {
    const existing = winnersAndLosers.find((x) => x.player === player);

    if (existing) {
      existing.win = win; // since only the win condition changes.
    } else {
      winnersAndLosers.push({
        win,
        code,
        player,
      });
    }
  }

  finalRoleMap.forEach((code, player) => {
    let win = false;
    if (code === "VIP" || code === "BOMBER") {
      win = !deaths.includes(player);
    } else if (code === "AGENT") {
      win = !deaths.includes(vip);
    } else if (code === "ASSASSIN") {
      win = deaths.includes(vip);
    } else if (code === "DECOY") {
      win = deaths.includes(player);
    } else if (code === "RED DECOY") {
      if (deaths.includes(vip)) {
        win = true;
      } else {
        const shotByAgent = votes.find(
          (x) => x.target === player && finalRoleMap.get(x.player) === "AGENT"
        );
        if (shotByAgent) {
          win = true;
        }
      }
    } else if (code === "BLUE DECOY") {
      if (!deaths.includes(vip)) {
        win = true;
      } else {
        const shotByAssassin = votes.find(
          (x) =>
            x.target === player && finalRoleMap.get(x.player) === "ASSASSIN"
        );
        if (shotByAssassin) {
          win = true;
        }
      }
    }

    addOrUpdateWinnersAndLosers(win, code, player.username);
  });

  const bombers = findPlayersByRole("BOMBER");

  if (bombers && bombers.length > 0) {
    const bomber = bombers[0];

    // bomber not shot, everybody loses except for bomber
    if (!deaths.includes(bomber[0])) {
      finalRoleMap.forEach((code, player) => {
        if (code && code === "BOMBER") return;

        addOrUpdateWinnersAndLosers(false, code, player.username);
      });
    }
  }
}
