import { NextApiRequest } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  findAllPlayers,
  movePlayerSeat,
  removePlayer,
  userIsHost,
} from "@/services/playerservice";
import { broadcast, findAllClients as findAllSocketClients } from "../socket";

export default async function handler(req: NextApiRequest, res: any) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401);
    return;
  }

  const body = JSON.parse(req.body && req.body.length > 0 ? req.body : "{}");
  const host = userIsHost(session.user.name);

  if (req.method === "GET") {
    return res.json(findAllPlayers());
  } else if (req.method === "POST") {
    if (!host) {
      const errObj = { err: "non-host attempted to call POST /player API" };
      console.log(errObj);
      return res.status(401).json(errObj);
    }

    const param = req.query.param ?? "";
    console.log(`POST /player/${param}`);

    if (param.length === 0) {
      const errObj = { err: "POST /layer INSUFFICIENT API QUERY" };
      return res.json(errObj);
    }
    const [paramA, paramB, paramC] = param.toString().trim().split(",");
    console.log(`params ${paramA}/${paramB}/${paramC}`);

    if (paramA === "move") {
      const { username, up } = body as { username: string; up: boolean };
      console.log(`moving ${username} ${up ? "up" : "down"}`);
      const moved = movePlayerSeat(username, up);
      if (moved) {
        broadcast(res.socket.server.io);
      }
    }

    res.json({});
  } else {
    console.log(`unknown method`);
  }
}

function kick(req: NextApiRequest, res: any, username: string) {
  const io = res.socket.server.io;

  if (!io) {
    console.log(`can't kick ${username} because of null res socket server io`);
    return;
  }

  const filters = findAllSocketClients().filter(
    (x) => x.player.username === username
  );

  filters.forEach((x) => {
    x.socket.disconnect();
  });

  removePlayer(username);
}
