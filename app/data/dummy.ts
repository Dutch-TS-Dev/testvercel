// teams.ts
import { Team } from "@/types";
import { Player } from "@/types";

export const players: Array<Player> = [
  {
    id: "3a7e1edb-65bf-4e3c-a8e4-8635d2c851a4",
    name: "Thomas Müller",
    age: 28,
    email: "thomas.mueller@example.com",
    teamId: "8a5d0e1c-154f-47e2-93e1-a4b25c61415b",
    rank: 1,
  },
  {
    id: "f2a28290-1e9c-48a5-b1e7-2c2a8fa86eccr",
    name: "Julia Weber",
    age: 24,
    email: "julia.weber@example.com",
    teamId: "8a5d0e1c-154f-47e2-93e1-a4b25c61415b",
    rank: 2,
  },
  {
    id: "6ac3e4b7-bf9c-4d94-9dc8-5517bc2e87a7",
    name: "Michael Schmidt",
    age: 32,
    email: "michael.schmidt@example.com",
    teamId: "3c6f2e1d-9b4a-4e8c-ba27-34d6e71a5c82",
    rank: 3,
  },
  {
    id: "1d8f3a6e-2c7b-45d9-b1a8-9e5c4f8d2e3b",
    name: "Laura Fischer",
    age: 27,
    email: "laura.fischer@example.com",
    teamId: "3c6f2e1d-9b4a-4e8c-ba27-34d6e71a5c82",
    rank: 4,
  },
  {
    id: "9b5c7a3e-1d8f-42e6-b3a7-5c2d1e9f8a4b",
    name: "Stefan Wagner",
    age: 30,
    email: "stefan.wagner@example.com",
    teamId: "5e9d2c7b-1a8f-43e6-b7c1-9d8e2a5f4b3c",
    rank: 5,
  },
  {
    id: "4b2e8c7a-3d9f-41e5-a6b2-8c7d3e5f9a1b",
    name: "Sophia Becker",
    age: 23,
    email: "sophia.becker@example.com",
    teamId: "5e9d2c7b-1a8f-43e6-b7c1-9d8e2a5f4b3c",
    rank: 6,
  },
  {
    id: "7d9e5a3b-2c4f-48d7-b1a9-3e8c6f4d2b5a",
    name: "Markus Hoffmann",
    age: 29,
    email: "markus.hoffmann@example.com",
    teamId: "7b2d9c4a-3e8f-41d6-a2b7-5c9d3e1f8a4b",
    rank: 7,
  },
  {
    id: "2e1d9c7b-4a3f-45e8-b2a7-1d8c5f3e9a4b",
    name: "Anna Schulz",
    age: 25,
    email: "anna.schulz@example.com",
    teamId: "7b2d9c4a-3e8f-41d6-a2b7-5c9d3e1f8a4b",
    rank: 8,
  },
  {
    id: "5a3b9e7d-2c8f-44d6-b1a5-9e3c7f2d4b8a",
    name: "David Koch",
    age: 33,
    email: "david.koch@example.com",
    teamId: "1d9c4b2e-7a3f-45e8-b2a7-5c9d3e1f8a4b",
    rank: 9,
  },
  {
    id: "8c4b2e7a-3d9f-41e5-a6b2-8c7d3e5f9a1b",
    name: "Lisa Meyer",
    age: 26,
    email: "lisa.meyer@example.com",
    teamId: "1d9c4b2e-7a3f-45e8-b2a7-5c9d3e1f8a4b",
    rank: 10,
  },
  {
    id: "3e8c5a7d-9b2f-46d4-b1a8-3e7c5f9d2b4a",
    name: "Jonas Richter",
    age: 31,
    email: "jonas.richter@example.com",
    teamId: "9c4b2e7a-3d1f-45e8-b2a7-5c9d3e1f8a4b",
    rank: 11,
  },
  {
    id: "6f4d2b5a-7c3e-48d9-b1a6-3e8c5f9d2b7a",
    name: "Lena Wolf",
    age: 22,
    email: "lena.wolf@example.com",
    teamId: "9c4b2e7a-3d1f-45e8-b2a7-5c9d3e1f8a4b",
    rank: 12,
  },
  {
    id: "9c7b5a3e-2d8f-46d4-b1a9-5e3c7f2d4b8a",
    name: "Felix Schäfer",
    age: 28,
    email: "felix.schaefer@example.com",
    teamId: "2e7d9c4a-3b8f-41d6-a2e7-5c9d3e1f8a4b",
    rank: 13,
  },
  {
    id: "2c8f4d6b-9a3e-47d5-b1a2-8e5c3f9d7b4a",
    name: "Emilia Bauer",
    age: 24,
    email: "emilia.bauer@example.com",
    teamId: "2e7d9c4a-3b8f-41d6-a2e7-5c9d3e1f8a4b",
    rank: 14,
  },
  {
    id: "5d9e7b3a-4c2f-48d6-b1a5-9e3c7f2d4b8a",
    name: "Niklas Klein",
    age: 34,
    email: "niklas.klein@example.com",
    teamId: "4b7e1d9c-5a3f-42e8-b7a2-1c9d3e5f8a4b",
    rank: 15,
  },
  {
    id: "8f4d2b5a-7c3e-49d8-b1a6-3e8c5f9d2b7a",
    name: "Hannah Schneider",
    age: 27,
    email: "hannah.schneider@example.com",
    teamId: "4b7e1d9c-5a3f-42e8-b7a2-1c9d3e5f8a4b",
    rank: 16,
  },
  {
    id: "1c8f4d6b-9a3e-47d5-b1a2-8e5c3f9d7b4a",
    name: "Leon Zimmermann",
    age: 29,
    email: "leon.zimmermann@example.com",
    teamId: "6a9c4b2e-7d3f-45e8-b2a7-5c9d3e1f8a4b",
    rank: 17,
  },
  {
    id: "4d9e7b3a-2c8f-45d6-b1a4-9e3c7f2d4b8a",
    name: "Sophie Krause",
    age: 25,
    email: "sophie.krause@example.com",
    teamId: "6a9c4b2e-7d3f-45e8-b2a7-5c9d3e1f8a4b",
    rank: 18,
  },
  {
    id: "7f4d2b5a-1c3e-48d9-b1a7-3e8c5f9d2b7a",
    name: "Tim Schwarz",
    age: 32,
    email: "tim.schwarz@example.com",
    teamId: "8c4b2e7a-9d3f-45e8-b2a7-5c9d3e1f8a4b",
    rank: 19,
  },
  {
    id: "0c8f4d6b-9a3e-47d5-b1a0-8e5c3f9d7b4a",
    name: "Marie Neumann",
    age: 26,
    email: "marie.neumann@example.com",
    teamId: "8c4b2e7a-9d3f-45e8-b2a7-5c9d3e1f8a4b",
    rank: 20,
  },
  {
    id: "3d9e7b3a-2c8f-45d6-b1a3-9e3c7f2d4b8a",
    name: "Lukas Werner",
    age: 30,
    email: "lukas.werner@example.com",
    teamId: "0c4b2e7a-3d9f-45e8-b2a0-5c9d3e1f8a4b",
    rank: 21,
  },
  {
    id: "6f4d2b5a-1c3e-48d9-b1a6-3e8c5f9d2b7a",
    name: "Emma Schmitt",
    age: 23,
    email: "emma.schmitt@example.com",
    teamId: "0c4b2e7a-3d9f-45e8-b2a0-5c9d3e1f8a4b",
    rank: 22,
  },
  {
    id: "9c8f4d6b-9a3e-47d5-b1a9-8e5c3f9d7b4a",
    name: "Paul Krüger",
    age: 31,
    email: "paul.krueger@example.com",
    teamId: "2c4b2e7a-3d9f-45e8-b2a2-5c9d3e1f8a4b",
    rank: 23,
  },
  {
    id: "2d9e7b3a-2c8f-45d6-b1a2-9e3c7f2d4b8a",
    name: "Mia Hofmann",
    age: 25,
    email: "mia.hofmann@example.com",
    teamId: "2c4b2e7a-3d9f-45e8-b2a2-5c9d3e1f8a4b",
    rank: 24,
  },
  {
    id: "5f4d2b5a-1c3e-48d9-b1a5-3e8c5f9d2b7a",
    name: "Jan Braun",
    age: 33,
    email: "jan.braun@example.com",
    teamId: "4c4b2e7a-3d9f-45e8-b2a4-5c9d3e1f8a4b",
    rank: 25,
  },
  {
    id: "8c8f4d6b-9a3e-47d5-b1a8-8e5c3f9d7b4a",
    name: "Lea König",
    age: 24,
    email: "lea.koenig@example.com",
    teamId: "4c4b2e7a-3d9f-45e8-b2a4-5c9d3e1f8a4b",
    rank: 26,
  },
  {
    id: "1d9e7b3a-2c8f-45d6-b1a1-9e3c7f2d4b8a",
    name: "Finn Huber",
    age: 28,
    email: "finn.huber@example.com",
    teamId: "6c4b2e7a-3d9f-45e8-b2a6-5c9d3e1f8a4b",
    rank: 27,
  },
  {
    id: "4f4d2b5a-1c3e-48d9-b1a4-3e8c5f9d2b7a",
    name: "Sarah Peters",
    age: 27,
    email: "sarah.peters@example.com",
    teamId: "6c4b2e7a-3d9f-45e8-b2a6-5c9d3e1f8a4b",
    rank: 28,
  },
  {
    id: "7c8f4d6b-9a3e-47d5-b1a7-8e5c3f9d7b4a",
    name: "Max Berger",
    age: 32,
    email: "max.berger@example.com",
    teamId: "8c4b2e7a-3d9f-45e8-b2a8-5c9d3e1f8a4b",
    rank: 29,
  },
  {
    id: "0d9e7b3a-2c8f-45d6-b1a0-9e3c7f2d4b8a",
    name: "Lara Herrmann",
    age: 26,
    email: "lara.herrmann@example.com",
    teamId: "8c4b2e7a-3d9f-45e8-b2a8-5c9d3e1f8a4b",
    rank: 30,
  },
];

export const teams: Array<Team> = [
  {
    id: "8a5d0e1c-154f-47e2-93e1-a4b25c61415b",
    name: "Eagles",
    rank: 1,
    playerIds: [
      "3a7e1edb-65bf-4e3c-a8e4-8635d2c851a4", // Thomas Müller
      "f2a28290-1e9c-48a5-b1e7-2c2a8fa86eccr", // Julia Weber
    ],
  },
  {
    id: "3c6f2e1d-9b4a-4e8c-ba27-34d6e71a5c82",
    name: "Tigers",
    rank: 2,
    playerIds: [
      "6ac3e4b7-bf9c-4d94-9dc8-5517bc2e87a7", // Michael Schmidt
      "1d8f3a6e-2c7b-45d9-b1a8-9e5c4f8d2e3b", // Laura Fischer
    ],
  },
  {
    id: "5e9d2c7b-1a8f-43e6-b7c1-9d8e2a5f4b3c",
    name: "Hawks",
    rank: 3,
    playerIds: [
      "9b5c7a3e-1d8f-42e6-b3a7-5c2d1e9f8a4b", // Stefan Wagner
      "4b2e8c7a-3d9f-41e5-a6b2-8c7d3e5f9a1b", // Sophia Becker
    ],
  },
  {
    id: "7b2d9c4a-3e8f-41d6-a2b7-5c9d3e1f8a4b",
    name: "Lions",
    rank: 4,
    playerIds: [
      "7d9e5a3b-2c4f-48d7-b1a9-3e8c6f4d2b5a", // Markus Hoffmann
      "2e1d9c7b-4a3f-45e8-b2a7-1d8c5f3e9a4b", // Anna Schulz
    ],
  },
  {
    id: "1d9c4b2e-7a3f-45e8-b2a7-5c9d3e1f8a4b",
    name: "Panthers",
    rank: 5,
    playerIds: [
      "5a3b9e7d-2c8f-44d6-b1a5-9e3c7f2d4b8a", // David Koch
      "8c4b2e7a-3d9f-41e5-a6b2-8c7d3e5f9a1b", // Lisa Meyer
    ],
  },
  {
    id: "9c4b2e7a-3d1f-45e8-b2a7-5c9d3e1f8a4b",
    name: "Sharks",
    rank: 6,
    playerIds: [
      "3e8c5a7d-9b2f-46d4-b1a8-3e7c5f9d2b4a", // Jonas Richter
      "6f4d2b5a-7c3e-48d9-b1a6-3e8c5f9d2b7a", // Lena Wolf
    ],
  },
  {
    id: "2e7d9c4a-3b8f-41d6-a2e7-5c9d3e1f8a4b",
    name: "Ravens",
    rank: 7,
    playerIds: [
      "9c7b5a3e-2d8f-46d4-b1a9-5e3c7f2d4b8a", // Felix Schäfer
      "2c8f4d6b-9a3e-47d5-b1a2-8e5c3f9d7b4a", // Emilia Bauer
    ],
  },
  {
    id: "4b7e1d9c-5a3f-42e8-b7a2-1c9d3e5f8a4b",
    name: "Wolves",
    rank: 8,
    playerIds: [
      "5d9e7b3a-4c2f-48d6-b1a5-9e3c7f2d4b8a", // Niklas Klein
      "8f4d2b5a-7c3e-49d8-b1a6-3e8c5f9d2b7a", // Hannah Schneider
    ],
  },
  {
    id: "6a9c4b2e-7d3f-45e8-b2a7-5c9d3e1f8a4b",
    name: "Bears",
    rank: 9,
    playerIds: [
      "1c8f4d6b-9a3e-47d5-b1a2-8e5c3f9d7b4a", // Leon Zimmermann
      "4d9e7b3a-2c8f-45d6-b1a4-9e3c7f2d4b8a", // Sophie Krause
    ],
  },
  {
    id: "8c4b2e7a-9d3f-45e8-b2a7-5c9d3e1f8a4b",
    name: "Falcons",
    rank: 10,
    playerIds: [
      "7f4d2b5a-1c3e-48d9-b1a7-3e8c5f9d2b7a", // Tim Schwarz
      "0c8f4d6b-9a3e-47d5-b1a0-8e5c3f9d7b4a", // Marie Neumann
    ],
  },
  {
    id: "0c4b2e7a-3d9f-45e8-b2a0-5c9d3e1f8a4b",
    name: "Cobras",
    rank: 11,
    playerIds: [
      "3d9e7b3a-2c8f-45d6-b1a3-9e3c7f2d4b8a", // Lukas Werner
      "6f4d2b5a-1c3e-48d9-b1a6-3e8c5f9d2b7a", // Emma Schmitt
    ],
  },
  {
    id: "2c4b2e7a-3d9f-45e8-b2a2-5c9d3e1f8a4b",
    name: "Jaguars",
    rank: 12,
    playerIds: [
      "9c8f4d6b-9a3e-47d5-b1a9-8e5c3f9d7b4a", // Paul Krüger
      "2d9e7b3a-2c8f-45d6-b1a2-9e3c7f2d4b8a", // Mia Hofmann
    ],
  },
  {
    id: "4c4b2e7a-3d9f-45e8-b2a4-5c9d3e1f8a4b",
    name: "Owls",
    rank: 13,
    playerIds: [
      "5f4d2b5a-1c3e-48d9-b1a5-3e8c5f9d2b7a", // Jan Braun
      "8c8f4d6b-9a3e-47d5-b1a8-8e5c3f9d7b4a", // Lea König
    ],
  },
  {
    id: "6c4b2e7a-3d9f-45e8-b2a6-5c9d3e1f8a4b",
    name: "Dolphins",
    rank: 14,
    playerIds: [
      "1d9e7b3a-2c8f-45d6-b1a1-9e3c7f2d4b8a", // Finn Huber
      "4f4d2b5a-1c3e-48d9-b1a4-3e8c5f9d2b7a", // Sarah Peters
    ],
  },
  {
    id: "8c4b2e7a-3d9f-45e8-b2a8-5c9d3e1f8a4b",
    name: "Foxes",
    rank: 15,
    playerIds: [
      "7c8f4d6b-9a3e-47d5-b1a7-8e5c3f9d7b4a", // Max Berger
      "0d9e7b3a-2c8f-45d6-b1a0-9e3c7f2d4b8a", // Lara Herrmann
    ],
  },
];
