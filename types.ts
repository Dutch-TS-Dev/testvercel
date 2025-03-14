import { faker } from "@faker-js/faker";

export type Player = {
  id: string;
  name: string;
  age: number;

  email: string;
};

export type Team = {
  id: string;
  name: string;
  rank: number;
  players: Player[];
  position: number;
};

export enum MATCH_TYPE {
  DOUBLES = "DOUBLES",
  SINGLES = "SINGLES",
}

export type Match = {
  id: string;
  type: MATCH_TYPE;
  winner: 1 | 2;
  participant1ID: string;
  participant2ID: string;
  reporter: 1 | 2;
  score: string; // 11-2-11-3-
  date: Date;
  location: string;
};

export type Ladder = {
  id: string;
  type: MATCH_TYPE;
  roundIds: Array<string>;
  name: string;
};

export type Round = {
  startDate: number;
  endDate: number;
  matchType: MATCH_TYPE;
  ranking: Array<string>; // ranked ids
  matchIds: Array<string>;
};

const player1: Player = {
  id: "8sd9dgg98",
  name: "eric",
  age: 22,
  email: faker.internet.email(),
};

const player2: Player = {
  id: "8sd9deeegg98",
  name: "hans",
  age: 23,
  email: faker.internet.email(),
};

const match: Match = {
  id: "8sd9eedgg98",
  type: MATCH_TYPE.SINGLES,
  winner: 1,
  participant1ID: player1.id,
  participant2ID: player2.id,
  reporter: 1,
  score: "11-2, 11-3",
  date: new Date(),
  location: "Court 1",
};

// Story:
// Every Sunday at 00:00, a new round is generated for the ongoing sports competition.
// The competition consists of two players, Eric and Hans, who compete against each other in singles matches.
// The getRound function is responsible for creating a new round, which includes the match details for the upcoming week.
// The function takes an array of participants (either teams or players) and generates a new round with a unique set of matches.
// The matches are scheduled based on the participants' availability and previous performance.

// Situation 1
// 1. Jing
// 2. Oscar

// 2 emails: liebe ${name}, du spielst gegen Jing/Oscar
//

// Situation 2
// Jing,  Oscar gab es
// neue spieler Jian, Hans
// 4 spieler: Jing,  Oscar, Jian, Hans

// 2 emails: liebe ${name}, du spielst gegen Jing/Oscar
//

// Situation 3
// 1. Jing
// 2. Oscar
// -. Hans
// -. Erik
// ... 100 andere spieler

const generateRound = (participants: Array<Team> | Array<Player>): Round => {
  // get last weeks ranking
  // 1 vs 3 <-- 3 gewinnt: 3 wird 1
  // 2 vs 4 < --- 2 gewinnt: beide bleiben gleich

  const startDate = Date.now();
  const endDate = startDate + 7 * 24 * 60 * 60 * 1000; // One week later

  const matchIds = participants.map((participant, index) => {
    const match: Match = {
      id: faker.datatype.uuid(),
      type: MATCH_TYPE.SINGLES,
      winner: index % 2 === 0 ? 1 : 2, // Alternate winners for simplicity
      participant1ID: participants[0].id,
      participant2ID: participants[1].id,
      reporter: 1,
      score: "11-2, 11-3",
      date: new Date(startDate + index * 24 * 60 * 60 * 1000), // One match per day
      location: `Court ${index + 1}`,
    };
    return match.id;
  });

  return {
    startDate,
    endDate,
    matchType: MATCH_TYPE.SINGLES,
    participantIds: participants.map((p) => p.id),
    matchIds,
  };
};

const startWeek = (): void => {
  const participants: Array<Player> = [player1, player2];
  const newRound = generateRound(participants);
  console.log("New round generated:", newRound);
};

startWeek();

// func generateRound wird jede Sonntag 00:00 ausgeführt
// ergibt:
// - neue Runde
// - Rangliste letzte woche
const getRound = (participants: Array<Team> | Array<Player>): Round => {};

const startWeek = (): void => {};
// const createRound = (participants: Array<Team> | Array<Player>) => {};

const frontEndExample = () => {
  // const {teamName, matchType} = {};
};

// generate
// create
