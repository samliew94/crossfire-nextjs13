import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { findAllPlayers, removePlayer } from "@/services/playerservice";
import { updateGameProgress } from "@/services/gameservice";
import { Progress } from "@/enums/progress";
import { broadcast, findAllClients, socketOnRemovedPlayer } from "../socket";
import { resetSetup, updateSelectedOption } from "@/services/setupservice";
import { resetShuffle, shuffle } from "@/services/shuffleservice";
import { resetLogs } from "@/services/logservice";
import { resetTimer } from "@/services/timerservice";
import { onVote, resetVote } from "@/services/voteservice";
import { resetResult } from "@/services/resultservice";

export default async function handler(req: NextApiRequest, res: any) {
  const session = await getServerSession(req, res, authOptions);
  const method = req.method;
  const params = req.query.param as string[] | null;
  const [a, b, c] = params ?? [null, null, null];
  console.log(`${req.method} API /game/${a}/${b}/${c} ... body=${req.body})}`);

  if (!session) {
    console.log(`UNAUTHENTICATED`);
    return res.status(401);
  }

  if (method === "GET") {
    return res.json({});
  } else if (method === "POST") {
    if (a === "hardreset") {
      console.log(`back to lobby...`);
      updateGameProgress(Progress.LOBBY);
    } else if (a === "kick") {
      onKick(req, res);
    } else if (a === "tosetup") {
      toSetup(req, res);
    } else if (a === "updateselectedoption") {
      onUpdateSelectedOption(req, res);
    } else if (a === "start") {
      start(req, res);
    } else if (a === "tovote") {
      toVote(req, res);
    } else if (a === "voteplayer") {
      await votePlayer(req, res);
    } else if (a === "restart") {
      restartGame(req, res);
    }
  }

  broadcast(res.socket.server.io);

  res.json({});
}

function onKick(req: NextApiRequest, res: any) {
  const { username } = JSON.parse(req.body);
  if (!username || username.length === 0) {
    console.log(`can't kick user. invalid username`);
    return;
  }

  removePlayer(username);
  socketOnRemovedPlayer(username);
}

function toSetup(req: NextApiRequest, res: any) {
  const length = findAllPlayers().length;
  if (length < 5 || length > 10) {
    console.log(`insufficient players to play (count = ${length})`);
    return;
  }
  resetSetup();
  updateGameProgress(Progress.SETUP);
}

function onUpdateSelectedOption(req: NextApiRequest, res: any) {
  updateSelectedOption(req, res);
}

function start(req: NextApiRequest, res: any) {
  resetResult();
  resetLogs();
  resetShuffle();
  shuffle(req, res);
  resetTimer();
  updateGameProgress(Progress.IDENTITY);
}

function toVote(req: NextApiRequest, res: any) {
  resetVote();
  updateGameProgress(Progress.VOTE);
}

async function votePlayer(req: NextApiRequest, res: any) {
  await onVote(req, res);
}

function restartGame(req: NextApiRequest, res: any) {
  updateGameProgress(Progress.LOBBY);
}
