import { faker } from "@faker-js/faker";

type Player = {
  name: string;
  age: number;
};

type Team = {
  name: string;
  rank: number;
  players: Player[];
};

const generateRandomTeams = (
  numTeams: number,
  numPlayersPerTeam: number
): Team[] => {
  const teams: Team[] = [];
  for (let i = 0; i < numTeams; i++) {
    const players: Player[] = [];
    for (let j = 0; j < numPlayersPerTeam; j++) {
      players.push({
        name: faker.name.fullName(),
        age: faker.datatype.number({ min: 18, max: 40 }),
      });
    }
    teams.push({
      name: faker.company.name(),
      rank: i + 1,
      players,
    });
  }
  return teams;
};

const teams = generateRandomTeams(25, 50);
console.log(teams);

// register as a team here!
// do you have user account? if yes log in
// user Peter log ein^

// who is your teammate? <-- give email address
// johannes@gmail.com

// wenn bekannt: suchen, und email shicken zu teammate: stimmt es dass du mitglieder bist in diesem team?
// johannes@gmail.com
// // wir schicken einaldung mit url : unseredomain.com/8s7dsdg67dsg678sdg768gs768

// back end: do we know this second
