import path from "path";
import { writeFileSync } from "fs";
import { faker } from "@faker-js/faker";
import { randomUUID as uuid } from "crypto";

import { Match, MATCH_TYPE, Player, Round } from "@/types";

// const players: Player[] = [];
// for (let i = 1; i <= 6; i++) {
//   players.push({
//     id: i.toString(),
//     name: `human_${i}`,
//     age: i,
//     email: `${i}@b.c`,
//   });
// }

// const playersFunctional = new Array(6).fill("").map((_, i) => ({
//   id: i.toString(),
//   name: `human_${i}`,
//   age: i,
//   email: `${i}@b.c`,
// }));

// console.log("log before exit");
// process.exit();

// const [player1, player2, player3, player4, player5, player6] = players;

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

const player3: Player = {
  id: uuid(),
  name: faker.name.firstName(),
  age: 18,
  email: faker.internet.email(),
};

const player4: Player = {
  id: uuid(),
  name: faker.name.firstName(),
  age: 23,
  email: faker.internet.email(),
};

const player5: Player = {
  id: uuid(),
  name: faker.name.firstName(),
  age: 88,
  email: faker.internet.email(),
};

const player6: Player = {
  id: uuid(),
  name: faker.name.firstName(),
  age: 27,
  email: faker.internet.email(),
};

const players = [player1, player2, player3, player4, player5, player6];

const match: Match = {
  id: "8sd9eedgg98",
  type: MATCH_TYPE.SINGLES,
  winner: 1,
  participant1_ID: player1.id,
  participant2_ID: player2.id,
  reporter: 1,
  score: "11-2, 11-3",
  date: new Date(),
  location: "Court 1",
};
function stripMatches(matches: Match[]): Array<[string, string, string]> {
  return matches.map((match) => [
    match.participant1_ID,
    match.participant2_ID,
    match.score,
  ]);
}

const matches: Match[] = [
  {
    id: uuid(),
    type: MATCH_TYPE.SINGLES,
    winner: 1,
    participant1_ID: player1.id,
    participant2_ID: player2.id,
    reporter: 1,
    score: "11-5, 11-7",
    date: new Date(),
    location: "Court 1",
  },
  {
    id: uuid(),
    type: MATCH_TYPE.SINGLES,
    winner: 2,
    participant1_ID: player3.id,
    participant2_ID: player4.id,
    reporter: 2,
    score: "11-9, 11-8",
    date: new Date(),
    location: "Court 2",
  },
  {
    id: uuid(),
    type: MATCH_TYPE.SINGLES,
    winner: 1,
    participant1_ID: player5.id,
    participant2_ID: player6.id,
    reporter: 1,
    score: "11-6, 11-4",
    date: new Date(),
    location: "Court 3",
  },
];

const stripped = stripMatches(matches);

console.log("logged: stripped", stripped);

const strippedMatches = stripMatches(matches);
console.log(strippedMatches);

const previousRound: Round = {
  startDate: Date.now(),
  endDate: Date.now() + 1000 * 60 * 60 * 24, // 1 day later
  matchType: MATCH_TYPE.SINGLES,
  ranking: players.map((player) => player.id),
  matchIds: matches.map((match) => match.id),
};

// const newMatches: Match[] = [];

// for (let i = 0; i < players.length; i += 2) {
//   if (i + 1 < players.length) {
//     newMatches.push({
//       id: uuid(),
//       type: MATCH_TYPE.SINGLES,
//       winner: Math.random() > 0.5 ? 1 : 2,
//       participant1_ID: players[i].id,
//       participant2_ID: players[i + 1].id,
//       reporter: Math.random() > 0.5 ? 1 : 2,
//       score: `${Math.floor(Math.random() * 11)}-${Math.floor(
//         Math.random() * 11
//       )}, ${Math.floor(Math.random() * 11)}-${Math.floor(Math.random() * 11)}`,
//       date: new Date(),
//       location: `Court ${i / 2 + 1}`,
//     });
//   }
// }

const oldMatches = [
  {
    id: "9149e95f-e49b-4726-9fea-c06005a62954",
    type: "SINGLES",
    winner: 1,
    participant1_ID: "8sd9dgg98",
    participant2_ID: "8sd9deeegg98",
    reporter: 1,
    score: "8-1, 5-4",
    date: "2025-03-15T14:12:16.975Z",
    location: "Court 1",
  },
  {
    id: "e9b3567c-c48f-4603-aa16-a5518e3d90ad",
    type: "SINGLES",
    winner: 1,
    participant1_ID: "91711041-acef-4c67-84e4-e14dbd68023d",
    participant2_ID: "d01e1fa6-55a7-4b77-9bbc-a54253481bee",
    reporter: 1,
    score: "5-8, 4-10",
    date: "2025-03-15T14:12:16.975Z",
    location: "Court 2",
  },
  {
    id: "7455557b-c14f-4b34-a162-001b6378f762",
    type: "SINGLES",
    winner: 1,
    participant1_ID: "7ea4b4c8-9bb5-4e4b-975b-a7dd5eed74a1",
    participant2_ID: "31687930-0819-481e-88fa-31560c23e9ec",
    reporter: 2,
    score: "5-9, 2-6",
    date: "2025-03-15T14:12:16.975Z",
    location: "Court 3",
  },
];

console.log(previousRound);

// const previousRound: Round =  {
//     startDate: number;
//     endDate: number;
//     matchType: MATCH_TYPE;
//     ranking: Array<string>;
//     matchIds: Array<string>;
// }

// hey gpt, here is list of indices that belong to players (you dont need player info)

// these matches happened: 0 vs 8. result: 11-2,11-3,11-1

// ['20-44', "2-8"]

// const frage = `
// ...${hintergrund}
// gib mir neue runde an wettbewerbe
// const oldRanking = ["sd78dgs78dg", "8sf89sdg8"]

// const matches: Match[] = [
//   {
// 78s78sggs7 vs 7s8dgdgs87gsd78: 11-2,11-2,11-2
//   }w
//   {
//     id: uuid(),
//     type: MATCH_TYPE.SINGLES,
//     winner: 2,
//     participant1ID: player3.id,
//     participant2ID: player4.id,
//     reporter: 2,
//     score: "11-9, 11-8",
//     date: new Date(),
//     location: "Court 2",
//   },
//   {
//     id: uuid(),
//     type: MATCH_TYPE.SINGLES,
//     winner: 1,
//     participant1ID: player5.id,
//     participant2ID: player6.id,
//     reporter: 1,
//     score: "11-6, 11-4",
//     date: new Date(),
//     location: "Court 3",
//   },
// ];

// gib mir neue runden
// `;
