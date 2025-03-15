import { faker } from "@faker-js/faker";
import { randomUUID as uuid } from "crypto";

import { Match, MATCH_TYPE, Player, Round } from "@/types";

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

const oldRanking = ["sd78dgs78dg", "8sf89sdg8"];

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

const matches: Match[] = [
  {
    id: uuid(),
    type: MATCH_TYPE.SINGLES,
    winner: 1,
    participant1ID: player1.id,
    participant2ID: player2.id,
    reporter: 1,
    score: "11-5, 11-7",
    date: new Date(),
    location: "Court 1",
  },
  {
    id: uuid(),
    type: MATCH_TYPE.SINGLES,
    winner: 2,
    participant1ID: player3.id,
    participant2ID: player4.id,
    reporter: 2,
    score: "11-9, 11-8",
    date: new Date(),
    location: "Court 2",
  },
  {
    id: uuid(),
    type: MATCH_TYPE.SINGLES,
    winner: 1,
    participant1ID: player5.id,
    participant2ID: player6.id,
    reporter: 1,
    score: "11-6, 11-4",
    date: new Date(),
    location: "Court 3",
  },
];

// const previousRound: Round =  {
//     startDate: number;
//     endDate: number;
//     matchType: MATCH_TYPE;
//     ranking: Array<string>;
//     matchIds: Array<string>;
// }

export { player1, player2, player3, player4, player5, player6, match, matches };

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
//   },
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
