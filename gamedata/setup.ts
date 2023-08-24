export const setupOptions = [
  {
    numPlayers: 5,
    sniperMode: false,
    roles: [
      { code: "VIP", num: 1, team: 0 },
      { code: "AGENT", num: 1, team: 0 },
      { code: "ASSASSIN", num: 1, team: 1 },
      { code: "RED DECOY", num: 1, team: 1 },
      { code: "BOMBER", num: 1, team: 2 },
    ],
  },
  {
    numPlayers: 6,
    sniperMode: false,
    roles: [
      { code: "VIP", num: 1, team: 0 },
      { code: "AGENT", num: 1, team: 0 },
      { code: "ASSASSIN", num: 2, team: 1 },
      { code: "BLUE DECOY", num: 1, team: 0 },
      { code: "BOMBER", num: 1, team: 2 },
    ],
  },
  {
    numPlayers: 7,
    sniperMode: false,
    roles: [
      { code: "VIP", num: 1, team: 0 },
      { code: "AGENT", num: 2, team: 0 },
      { code: "ASSASSIN", num: 2, team: 1 },
      { code: "DECOY", num: 1, team: 2 },
      { code: "BOMBER", num: 1, team: 2 },
    ],
  },
  {
    numPlayers: 8,
    sniperMode: false,
    roles: [
      { code: "VIP", num: 1, team: 0 },
      { code: "AGENT", num: 2, team: 0 },
      { code: "ASSASSIN", num: 2, team: 1 },
      { code: "DECOY", num: 1, team: 2 },
      { code: "RED DECOY", num: 1, team: 1 },
      { code: "BOMBER", num: 1, team: 2 },
    ],
  },
  {
    numPlayers: 9,
    sniperMode: false,
    roles: [
      { code: "VIP", num: 1, team: 0 },
      { code: "AGENT", num: 3, team: 0 },
      { code: "ASSASSIN", num: 3, team: 1 },
      { code: "DECOY", num: 1, team: 2 },
      { code: "BOMBER", num: 1, team: 2 },
    ],
  },
  {
    numPlayers: 10,
    sniperMode: false,
    roles: [
      { code: "VIP", num: 1, team: 0 },
      { code: "AGENT", num: 3, team: 0 },
      { code: "ASSASSIN", num: 3, team: 1 },
      { code: "RED DECOY", num: 1, team: 0 },
      { code: "BLUE DECOY", num: 1, team: 1 },
      { code: "BOMBER", num: 1, team: 2 },
    ],
  },
];

export const winCondition = {
  vip: "You win if you are not shot",
  agent: "You win if the VIP is not shot",
  assassin: "You win if the VIP is shot",
  decoy: "You win if you are shot",
  bomber: "If you are not shot, you win and everyone else loses",
  blueDecoy: "You win if the VIP is not shot OR you are shot by an Assassin",
  redDecoy: "You win if the VIP is shot OR you are shot by an Agent",
};
