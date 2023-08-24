import { NextApiRequest } from "next";
import { getLatestSetup } from "./setupservice";
import Player from "@/models/player";
import { findAllPlayers, findHost } from "./playerservice";
import { secureShuffleArray } from "./randomservice";

const finalRoleMap = new Map<Player, string>();

let draws: {
  count: number;
  code: string;
  player: Player;
  sender?: Player | undefined;
  shuffledWithP1?: Player;
  shuffledWithP2?: Player;
}[] = [];

const shuffledPlayers = new Set<Player>();

const shuffledPlayersCount = new Map<Player, number>();

const shuffles: {
  player: Player;
  p1: Player;
  p2: Player;
}[] = [];

export function resetShuffle() {
  finalRoleMap.clear();
  draws.length = 0;
  shuffledPlayers.clear();
  shuffledPlayersCount.clear();
  shuffles.length = 0;
}

export function shuffle(req: NextApiRequest, res: any) {
  const { options, selectedOption } = getLatestSetup();
  const setup = options[selectedOption];

  // const codes: string[] = [];
  // setup.roles.forEach((role) => {
  //   for (let index = 0; index < role.num; index++) {
  //     codes.push(role.code);
  //   }
  // });

  const roles = secureShuffleArray(
    setup.roles.flatMap((x) => Array(x.num).fill(x.code))
  );

  const players = findAllPlayers(); // first player is considered the dealer.
  let pIndex = 0;
  for (let i = 0; i < roles.length; i++, pIndex++) {
    let code = roles[i];
    const player = players[pIndex];
    const playerNext = players[pIndex + 1 === players.length ? 0 : pIndex + 1];

    // 1. give each player their FIRST card
    draws.push({
      count: 0,
      code,
      player: player,
    });

    // 2. MID gives LEFT. RIGHT gives MID.
    draws.push({
      count: 1,
      code,
      player: playerNext,
      sender: player,
    });

    const curDraw = draws[draws.length - 1];

    // initialize finalRoleMap using secondDraws since the latter are considered to be final already.
    finalRoleMap.set(curDraw.player, curDraw.code);
  }

  // 3. all players are shuffled with neighbors, starting from player at seat one
  let cur = 0;
  while (shuffledPlayers.size !== players.length) {
    const next = cur + 1 === players.length ? 0 : cur + 1;
    const prev = cur - 1 === -1 ? players.length - 1 : cur - 1;

    const nextCurPrev: Player[] = [];
    nextCurPrev.push(players[next]);
    nextCurPrev.push(players[cur]);
    nextCurPrev.push(players[prev]);

    let threeCodes: string[] = [];
    nextCurPrev.forEach((ncp) => {
      shuffledPlayers.add(ncp);

      const frm = finalRoleMap.get(ncp);

      if (frm && frm.length > 0) {
        threeCodes.push(frm);
      }
    });

    threeCodes = secureShuffleArray(threeCodes);

    for (let x = 0; x < 3; x++) {
      finalRoleMap.set(nextCurPrev[x], threeCodes[x]);
      shuffledPlayersCount.set(
        nextCurPrev[x],
        (shuffledPlayersCount.get(nextCurPrev[x]) || 1) + 1
      );
    }

    shuffles.push({
      player: nextCurPrev[1],
      p1: nextCurPrev[0],
      p2: nextCurPrev[2],
    });

    for (let x = 0; x < 3; x++) {
      const p1 = x === 0 ? 1 : x === 1 ? 2 : 0;
      const p2 = x === 0 ? 2 : x === 1 ? 0 : 1;

      draws.push({
        count: shuffledPlayersCount.get(nextCurPrev[x]) || -1, // it must be >= 2.
        code: finalRoleMap.get(nextCurPrev[x]) || "",
        shuffledWithP1: nextCurPrev[p1], // 1 | 2 | 0
        player: nextCurPrev[x], // 0 | 1 | 2
        shuffledWithP2: nextCurPrev[p2], // 2 | 0 | 1
      });
    }

    cur += 3;

    if (cur >= players.length) {
      cur = 0;
    }
  }
}

/** returns the role code else null */
export function findFirstDrawCodeByPlayer(player: Player) {
  return draws.find((x) => x.player === player && x.count === 0)?.code;
}

/** returns the {code,sender} */
export function findSecondDrawCodeByPlayer(player: Player) {
  const draw = draws.find((x) => x.player === player && x.count === 1);

  return draw
    ? {
        code: draw.code,
        sender: draw.sender?.username,
      }
    : null;
}

/**
 * shuffledWiths:{
    {p1:string,p2:string}
 * }[] */
export function shuffledWithsByPlayer(player: Player) {
  return draws
    .filter((x) => x.count >= 2 && x.player === player)
    .map((item) => {
      return {
        count: item.count,
        code: item.code,
        p1: item.shuffledWithP1?.username,
        p2: item.shuffledWithP2?.username,
      };
    });
}

export function getFinalRoleMap() {
  return finalRoleMap;
}

export function findPlayersByRole(roleCode: string) {
  return Array.from(finalRoleMap.entries()).filter(
    ([, code]) => code === roleCode
  );
}

export function getShuffles() {
  return shuffles.map(({ player, p1, p2 }) => {
    return {
      player: player.username,
      p1: p1.username,
      p2: p2.username,
    };
  });
}
