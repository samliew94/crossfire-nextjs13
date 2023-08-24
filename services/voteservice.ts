import Player from "@/models/player";
import { findAllPlayers, findByUsername } from "./playerservice";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { updateGameProgress } from "./gameservice";
import { Progress } from "@/enums/progress";
import { Screen } from "@/enums/screen";
import { determineWinners } from "./resultservice";

/** one player votes a target */
const votes: {
  player: Player;
  target: Player;
}[] = [];

export function resetVote() {
  votes.length = 0;
}

export function getVoteData() {
  const players = findAllPlayers();

  const resMap = new Map<Player, any>();

  const didNotVote = waitingFor();

  players.forEach((player) => {
    resMap.set(player, {
      screen: Screen.VOTE,
      host: player.host,
      options: players
        .filter((x) => x.username !== player.username)
        .map((x) => x.username),
      selected: votes.find((x) => x.player === player)?.target.username ?? null,
      waitingFor: didNotVote,
    });
  });

  return resMap;
}

export async function onVote(req: NextApiRequest, res: any) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return;
  const reqPlayer = findByUsername(session.user.name);

  if (!reqPlayer) return;

  const player = votes.find((x) => x.player === reqPlayer);
  const body = JSON.parse(req.body);
  const target = findByUsername(body.username);

  if (!target) return;

  if (player) {
    player.target = target;
  } else {
    votes.push({
      player: reqPlayer,
      target,
    });
  }

  if (votes.length === findAllPlayers().length) {
    determineWinners();
    updateGameProgress(Progress.RESULT);
  }
}

/** returns a list of username */
function waitingFor() {
  const allPlayers = findAllPlayers();
  const allVoted = votes.map((x) => x.player);
  const didNotVote = allPlayers.filter((player) => !allVoted.includes(player));
  return didNotVote.map((x) => x.username);
}

export function getVotes() {
  return votes;
}
