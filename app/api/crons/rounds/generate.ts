import path from "path";
import { writeFileSync } from "fs";

import { teams } from "@/app/data/dummy";
import {
  Match,
  MATCH_TYPE,
  Player,
  Round,
  Team,
  INVITATION_STATUS,
  Invitation,
  COLLECTIONS,
} from "@/types";
import { uuid, setDocument, getDocuments, getDocument } from "@/db";

// Function to create a round with matches based on participants
const createRound = async (
  matchType: MATCH_TYPE,
  participants: Array<Team> | Array<Player>,
  previousRound?: Round
): Promise<Round> => {
  const startDate = Date.now();
  const endDate = startDate + 14 * 24 * 60 * 60 * 1000; // Two weeks later

  // Generate a unique ID for the round
  const roundId = uuid();

  // Get participant IDs
  let participantIds = participants.map((p) => p.id);

  // If there was a previous round, use its ranking to inform the pairings
  if (previousRound && previousRound.ranking.length > 0) {
    // Use the previous round's ranking to create seeded pairings
    participantIds = previousRound.ranking.filter((id) =>
      participantIds.includes(id)
    );

    // Add any new participants that weren't in the previous round
    const newParticipants = participants
      .filter((p) => !previousRound.ranking.includes(p.id))
      .map((p) => p.id);

    participantIds = [...participantIds, ...newParticipants];
  } else {
    // First round - shuffle the participants randomly
    participantIds = shuffleArray([...participantIds]);
  }

  const matches: Match[] = [];
  const matchIds: string[] = [];

  // Handle odd number of participants by giving a bye to the lowest ranked player
  if (participantIds.length % 2 !== 0) {
    // Sort players by rank to find lowest ranked
    const sortedParticipants = [...participants].sort((a, b) => {
      const rankA = (a as Player).rank || (a as Team).rank || 999;
      const rankB = (b as Player).rank || (b as Team).rank || 999;
      return rankB - rankA; // Descending order to get lowest rank last
    });

    // Get the lowest ranked player's ID
    const lowestRankedId = sortedParticipants[sortedParticipants.length - 1].id;

    // Remove the lowest ranked player from participants for this round
    participantIds = participantIds.filter((id) => id !== lowestRankedId);

    // Create a "bye" match for the player
    const byeMatch: Match = {
      id: uuid(),
      type: matchType,
      participant1_ID: lowestRankedId,
      participant2_ID: "BYE", // Special ID for a bye
      reporterId: "1", // Changed from number to string per Match type
      score: "",
      date: new Date(startDate + Math.random() * (endDate - startDate)),
      isBye: true,
    };

    // Save the bye match to Firebase
    await setDocument<Match>(COLLECTIONS.MATCHES, byeMatch);

    // Add to our local arrays
    matches.push(byeMatch);
    matchIds.push(byeMatch.id);
  }

  // Create matches for the remaining participants
  for (let i = 0; i < participantIds.length; i += 2) {
    if (i + 1 < participantIds.length) {
      const matchId = uuid();
      const match: Match = {
        id: matchId,
        type: matchType,
        participant1_ID: participantIds[i],
        participant2_ID: participantIds[i + 1],
        reporterId: "1", // Changed from number to string per Match type
        score: "", // Empty score at creation
        date: new Date(startDate + Math.random() * (endDate - startDate)), // Random date within the round period
      };

      // Save the match to Firebase
      await setDocument<Match>(COLLECTIONS.MATCHES, match);

      matches.push(match);
      matchIds.push(matchId);
    }
  }

  // Update the ranking based on the previous round and current participants
  // In a real implementation, this would reflect performance
  const ranking = [...participantIds]; // Simple placeholder

  // Create the round object
  const round: Round = {
    id: roundId,
    startDate,
    endDate,
    matchType,
    ranking,
    matchIds,
  };

  // Save the round to Firebase
  await setDocument<Round>(COLLECTIONS.ROUNDS, round);

  // Return the round with matches included for immediate use
  return {
    ...round,
  };
};

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Function to get the first round for a tournament (completely random order)
const getFirstRound = async (
  matchType: MATCH_TYPE,
  participants: Array<Team> | Array<Player>
): Promise<Round> => {
  const startDate = Date.now();
  const endDate = startDate + 14 * 24 * 60 * 60 * 1000; // Two weeks later

  // Completely randomize the participants for the first round
  const randomizedParticipants = shuffleArray([...participants]);
  if (!randomizedParticipants.length) {
    throw new Error("No participants in array after shuffling");
  }

  const matches: Match[] = [];
  const matchIds: string[] = [];
  const roundId = uuid(); // Added missing round ID

  if (randomizedParticipants.length % 2 !== 0) {
    const byeParticipant = randomizedParticipants.pop();
    const byeMatchId = uuid();
    const byeMatch: Match = {
      id: byeMatchId,
      type: matchType,
      participant1_ID: byeParticipant?.id!,
      participant2_ID: "BYE", // Changed to string from enum
      reporterId: "1", // Changed from number to string per Match type
      score: "",
      date: new Date(startDate + Math.random() * (endDate - startDate)),
      isBye: true,
    };

    // Save the bye match to Firebase
    await setDocument<Match>(COLLECTIONS.MATCHES, byeMatch);

    matches.push(byeMatch);
    matchIds.push(byeMatchId);
  }

  let participantIds = randomizedParticipants.map((p) => p.id);

  // Create random matches for the remaining participants
  for (let i = 0; i < participantIds.length; i += 2) {
    if (i + 1 < participantIds.length) {
      const matchId = uuid();
      const match: Match = {
        id: matchId,
        type: matchType,
        participant1_ID: participantIds[i],
        participant2_ID: participantIds[i + 1],
        reporterId: "1", // Changed from number to string per Match type
        score: "", // Empty score at creation
        date: new Date(startDate + Math.random() * (endDate - startDate)), // Random date within the round period
      };

      // Save the match to Firebase
      await setDocument<Match>(COLLECTIONS.MATCHES, match);

      matches.push(match);
      matchIds.push(matchId);
    }
  }

  // Create the initial ranking based on the random order
  const ranking = [...participantIds];

  // Create the round object with ID
  const round: Round = {
    id: roundId,
    startDate,
    endDate,
    matchType,
    ranking,
    matchIds,
  };

  // Save the round to Firebase
  await setDocument<Round>(COLLECTIONS.ROUNDS, round);

  return round;
};

// Function to schedule rounds for the next period (e.g., a season)
const scheduleSeason = async (
  singles: Array<Player>,
  teams: Array<Team>,
  numberOfRounds: number
): Promise<{ singlesRounds: Round[]; doublesRounds: Round[] }> => {
  const singlesRounds: Round[] = [];
  const doublesRounds: Round[] = [];

  // Create first rounds
  if (singles.length > 1) {
    const firstSinglesRound = await getFirstRound(MATCH_TYPE.SINGLES, singles);
    singlesRounds.push(firstSinglesRound);
  }

  if (teams.length > 1) {
    const firstDoublesRound = await getFirstRound(MATCH_TYPE.DOUBLES, teams);
    doublesRounds.push(firstDoublesRound);
  }

  // Create subsequent rounds
  for (let i = 1; i < numberOfRounds; i++) {
    if (singles.length > 1) {
      const nextSinglesRound = await createRound(
        MATCH_TYPE.SINGLES,
        singles,
        singlesRounds[i - 1]
      );
      singlesRounds.push(nextSinglesRound);
    }

    if (teams.length > 1) {
      const nextDoublesRound = await createRound(
        MATCH_TYPE.DOUBLES,
        teams,
        doublesRounds[i - 1]
      );
      doublesRounds.push(nextDoublesRound);
    }
  }

  return { singlesRounds, doublesRounds };
};

// Function to create a single round and save it to Firebase
export const createAndSaveRound = async () => {
  console.log("Creating a new round...");

  try {
    // First, check if there are any existing rounds
    const existingRounds = await getDocuments<Round>(COLLECTIONS.ROUNDS);
    let previousRound: Round | undefined;

    if (existingRounds.length > 0) {
      // Sort by startDate to find the most recent round
      const sortedRounds = existingRounds.sort(
        (a, b) => b.startDate - a.startDate
      );
      previousRound = sortedRounds[0];
      console.log(`Found previous round with ID: ${previousRound.id}`);

      // Create the next round using the previous round's information
      let playersList = await getDocuments<Player>(COLLECTIONS.PLAYERS);
      // if (playersList.length === 0) {
      //   // Save imported players to database if none exist
      //   for (const player of teams) {
      //     await setDocument<Player>(COLLECTIONS.PLAYERS, player);
      //   }
      //   playersList = teams;
      // }

      // return await createRound(MATCH_TYPE.SINGLES, playersList, previousRound);
    } else {
      // No previous rounds, create the first round
      console.log("No previous rounds found. Creating first round.");

      // Check if players exist in the database
      let playersList = await getDocuments<Player>(COLLECTIONS.PLAYERS);

      // If no players in database, use the imported players data
      if (playersList.length === 0) {
        console.log(
          "No players found in database. Using imported player data..."
        );

        // // Save imported players to database
        // for (const player of teams) {
        //   await setDocument<Player>(COLLECTIONS.PLAYERS, player);
        // }

        // playersList = teams;
      }

      console.log(
        `Using ${playersList.length} players for first round creation`
      );

      // Create the first round with completely random matchups
      return await getFirstRound(MATCH_TYPE.SINGLES, playersList);
    }
  } catch (error) {
    console.error("Error creating round:", error);
    throw error;
  }
};

const start = async () => {
  // const firstRound = await getFirstRound(MATCH_TYPE.DOUBLES, teams);
  // console.log(firstRound);
  // writeFileSync(
  //   path.join("/Users/oscarvanvelsen/Desktop/Dev/JSON/firstRound.json"),
  //   JSON.stringify(firstRound),
  //   "utf-8"
  // );
  // console.log(
  //   "wrote to /Users/oscarvanvelsen/Desktop/Dev/JSON/firstRound.json"
  // );
  // // Save the round to Firebase
  // await setDocument<Round>(COLLECTIONS.ROUNDS, firstRound);
};

// start();

// Export functions for use in other files
export { createRound, getFirstRound, scheduleSeason };
