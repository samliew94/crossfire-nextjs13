import { Server } from "socket.io";
import { verify } from "jsonwebtoken";
import { getLatestData, getProgress } from "../../services/gameservice";
import { getToken } from "next-auth/jwt";
import {
  findByUsername,
  findHost,
  addPlayer,
  removePlayer,
} from "@/services/playerservice";
import { Progress } from "@/enums/progress";
import { Screen } from "@/enums/screen";

/** {socket:socket, player:Player}[] */
let allClients = [];

export async function broadcast(io) {
  allClients.forEach(({ socket, player }) => {
    if (player.spectator) {
      io.to(socket.id).emit("data", {
        screen: Screen.SPECTATOR,
      });
      return;
    }

    const data = getLatestData().get(player);
    console.log(`data by player(${player})=${data}`);
    console.log(
      `emitting to player ${player.username}. Payload=${JSON.stringify(data)}`
    );
    io.to(socket.id).emit("data", data);
  });
}

export default async function SocketHandler(req, res) {
  // It means that socket server was already initialized
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    addTrailingSlash: false,
  });

  io.use((socket, next) => {
    const accessToken = findCookieByKey(
      "next-auth.session-token",
      socket.request.headers.cookie
    );

    try {
      const decoded = verify(accessToken, process.env.NEXTAUTH_SECRET);
      console.log(`socket (server) jwt decoded username=${decoded.name}`);
      socket.username = decoded.name;
      next();
    } catch (err) {
      console.log(`error when decoding jwt=${err.message}`);
      next(new Error(err.message));
    }
  });

  // Define actions inside
  io.on("connection", async (socket) => {
    const { id, username } = socket;

    socket.on("disconnect", () => {
      console.log(`SERVER ${id} ${username} disconnected`);
      allClients = allClients.filter((x) => x.socket.username !== username);
      broadcast(io);
    });

    // disconnect duplicate client sockets
    allClients
      .filter((x) => x.socket.username === username)
      .forEach((x) => x.socket.disconnect());

    // refresh allClients (it should not have the given username now)
    allClients = allClients.filter((x) => x.socket.username !== username);

    // if the game's progress is not lobby, prevent user from joining as the game is in progress
    if (getProgress() !== Progress.LOBBY) {
      // check if player has been registered in players (from playerservice)

      const player = findByUsername(username);

      if (!player) {
        // prevent new player from joining by disconnecting them immediately
        console.log(
          `new player ${username} attempts to join an ongoing game, disconnecting id=${id}`
        );
        socket.disconnect();
        return;
      }
    }

    const player = addPlayer(username);

    // add that username (we now should only have one!)
    allClients.push({
      socket,
      player,
    });

    console.log(`A client connected ${id} is ${username}`);

    console.log(`allClients length (${allClients.length}):`);
    allClients.forEach((x, i) => {
      console.log(`${i}. ${x.socket.id} ${x.socket.username}`);
    });

    broadcast(io);
  });

  res.socket.server.io = io;
  res.end();
  console.log("Initialized Socket");

  function findCookieByKey(key, cookies) {
    const arr = cookies.split(";");
    const index = arr.findIndex((c) => c.trim().startsWith(key + "="));

    return index === -1 ? null : arr[index].split("=")[1];
  }
}

export function findAllClients() {
  return allClients;
}

/** called when host kicks a player */
export function socketOnRemovedPlayer(username) {
  allClients
    .filter((x) => x.socket.username === username)
    .forEach((x) => x.socket.disconnect());
}
