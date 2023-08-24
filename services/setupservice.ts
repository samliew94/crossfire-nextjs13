import { setupOptions } from "@/gamedata/setup";
import { findAllPlayers } from "./playerservice";
import { NextApiRequest } from "next";
import Player from "@/models/player";
import { Screen } from "@/enums/screen";

let selectedOption = 0;

export function resetSetup() {
  selectedOption = 0;
}

export function getLatestSetupData() {
  const { options, selectedOption } = getLatestSetup();

  const resMap = new Map<Player, any>();

  const players = findAllPlayers();

  players.forEach((player) => {
    resMap.set(player, {
      screen: Screen.SETUP,
      host: player.host,
      options,
      selectedOption,
    });
  });

  console.log(`setupservice getLatestSetupData:`);
  console.log(`${JSON.stringify(resMap)}`);

  return resMap;
}

export function getLatestSetup() {
  let options = setupOptions.filter(
    (x) => x.numPlayers === findAllPlayers().length
  );

  if (options.length === 0) {
    options = setupOptions.filter((x) => x.numPlayers === 5);
  }

  return { options, selectedOption };
}

export function getSelectedSetupRoles() {
  const { options, selectedOption } = getLatestSetup();
  const option = options[selectedOption];

  return option.roles;
}

export function updateSelectedOption(req: NextApiRequest, res: any) {
  const body = JSON.parse(req.body);
  selectedOption = body.selectedOption;
}
