import Player from "@/models/player";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { getProgress } from "./gameservice";
import Lobby from "@/app/lobby/page";
import { Progress } from "@/enums/progress";

let players: Player[] = [];

export function findByUsername(username: string) {
  const player = players.find((x) => x.username === username) || null;
  console.log(
    `${player ? player.username + " found" : username + " not found"}`
  );

  if (!player) {
    console.log(`saved players are=${players.length}`);
  }

  return player;
}

export function userIsHost(username: string) {
  const player = findByUsername(username);
  return player?.host ?? false;
}

export function movePlayerSeat(username: string, up: boolean) {
  const player = players.find((x) => x.username === username) ?? null;

  if (player) {
    const oldSeat = player.seat;

    if (up && oldSeat === 0) {
      return;
    } else if (!up && oldSeat === players.length - 1) {
      return;
    }

    const newSeat = up ? oldSeat - 1 : oldSeat + 1;
    const otherPlayer = players.find((x) => x.seat === newSeat);

    if (otherPlayer) {
      otherPlayer.seat = oldSeat;
      player.seat = newSeat;
      players.sort((a, b) => a.seat - b.seat);
    } else {
      return false;
    }
  } else {
    return false;
  }

  return true;
}

export function findHost() {
  return players.find((x) => x.host);
}

/**
 * guaranteed to be sorted by seat order
 */
export function findAllPlayers() {
  console.log(`playerservice.findAllPlayers() (length:${players.length}): `);
  players.forEach((x) => {
    console.log(`Player(${x.username}) Seat(${x.seat}) Host(${x.host})`);
  });
  return players;
}

export function addPlayer(username: string) {
  const player = findByUsername(username);

  if (player) {
    console.log(`playerservice.addPlayer() ${username} found`);
    return player;
  }

  console.log(
    `playerservice.addPlayer() ${username} not found. Creating new player`
  );

  const newPlayer = new Player(username, players.length, players.length === 0);

  console.log(`push new player ${JSON.stringify(newPlayer)}`);
  players.push(newPlayer);

  return newPlayer;
}

export function removePlayer(username: string) {
  const player = players.find((x) => x.username === username);

  if (!player) {
    console.log(`can't remove player ${username}. User not found`);
    return;
  }

  const index = players.indexOf(player);
  players.splice(index, 1);
  console.log(`removed player ${username}`);
  findAllPlayers();
  console.log(`playerservice.removePlayer() reset seat order:`);

  // reset the seat order
  players.forEach((x, i) => {
    x.seat = i;
    console.log(`${x.username} = ${x.seat}`);
  });
}
