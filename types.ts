export enum COLLECTIONS {
  PLAYERS = "PLAYERS",
  INVITATIONS = "INVITATIONS",
  TEAMS = "TEAMS",
  MATCHES = "MATCHES",
  ROUNDS = "ROUNDS",
}

export type Player = {
  teamId?: string;
  id: string;
  name: string;
  age: number;
  rank?: number;
  email: string;
  emailVerified?: boolean;
  createdAt?: string;
  hasDUPR?: boolean;
};

export type Team = {
  id: string;
  name: string;
  rank: number;
  playerIds: string[];
};

export enum MATCH_TYPE {
  DOUBLES = "DOUBLES",
  SINGLES = "SINGLES",
  BYE = "BYE",
}

export type Match = {
  id: string;
  type: MATCH_TYPE;
  winner?: 1 | 2;
  participant1_ID: string;
  participant2_ID: string;
  reporterId: string; // ID of the player who reported the match
  score: string; // 11-2-11-3-
  date: Date;
  isBye?: boolean; // true if the match is a bye
};

export type Ladder = {
  id: string;
  type: MATCH_TYPE;
  roundIds: Array<string>;
  name: string;
};

export type Round = {
  id?: string;
  startDate: number;
  endDate: number;
  matchType: MATCH_TYPE;
  ranking: Array<string>; // ranked ids
  matchIds: Array<string>;
};

export enum INVITATION_STATUS {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export type Invitation = {
  id?: string;
  teamName: string;
  matchType?: MATCH_TYPE;
  inviterId: string;
  partnerId: string;
  status: INVITATION_STATUS;
  createdAt: any; // Use appropriate type for Firestore timestamp
  expiresAt: Date;
  confirmationToken?: string;
  rejectionToken?: string;
};
// Story:
// Every Sunday at 00:00, a new round is generated for the ongoing sports competition.
// The competition consists of two players, Eric and Hans, who compete against each other in singles matches.
// The getRound function is responsible for creating a new round, which includes the match details for the upcoming week.
// The function takes an array of participants (either teams or players) and generates a new round with a unique set of matches.
// The matches are scheduled based on the participants' availability and previous performance.

const generateRound = (
  matchType: MATCH_TYPE,
  participants: Array<Team> | Array<Player>,
  previousRound: Round
): Round => {
  const startDate = Date.now();
  const endDate = startDate + 7 * 24 * 60 * 60 * 1000; // One week later

  const matches: Match[] = [];
  const participantIds = participants.map((p) => p.id);
  const numMatches = Math.floor(participantIds.length / 2);

  return {
    startDate,
    endDate,
    matchType,
    ranking: [], // Placeholder, should be updated with actual ranking
    matchIds: matches.map((m) => m.id),
  };
};

const generateFirstRound = () => {};

const startWeek = (): void => {
  // const firstRound = generateRound(MATCH_TYPE.SINGLES, [
  //   player1,
  //   player2,
  //   player3,
  //   player4,
  // ]);
  // const previousRound =
  // const newRound = generateRound(MATCH_TYPE.SINGLES, [
  //   player1,
  //   player2,
  //   player3,
  //   player4,
  // ]);
};

// startWeek();
