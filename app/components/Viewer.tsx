import React from "react";

type Team = {
  name: string;
  position: number;
  letter: string;
  players: { name: string; rank: number }[];
};

type MatchProps = {
  teamA: Team;
  teamB: Team;
  playingForPosition: number;
};

const Match: React.FC<MatchProps> = ({ teamA, teamB, playingForPosition }) => {
  return (
    <div className="mb-6  rounded-lg overflow-hidden py-6 border-b border-t border-[rgba(255,255,255,0.3)]">
      <div className=" px-8 py-2 text-center text-sm text-white">
        Playing for rank #{playingForPosition}
      </div>

      {/* Team A */}
      <div className="flex items-center p-4 pb-2 px-0">
        <div className="h-12 w-12 rounded-full border border-[#f23363] flex items-center justify-center mr-4">
          <span className="text-xl">{teamA.letter}</span>
        </div>
        <div className="flex-grow">
          <div className="font-bold text-white mb-2">{teamA.name}</div>
          <div className="text-xs text-gray-400 ">
            {teamA.players[0].name} & {teamA.players[1].name}
          </div>
        </div>
        <div className="text-white font-bold text-lg">#{teamA.position}</div>
      </div>

      {/* VS Divider */}
      <div className="flex justify-center items-center py-2">
        <div className="w-8 h-0.5 bg-[#f23363]"></div>
        <div className="mx-3 text-[#f23363] font-bold">VS</div>
        <div className="w-8 h-0.5 bg-[#f23363]"></div>
      </div>

      {/* Team B */}
      <div className="flex items-center p-4 py-2 px-0">
        <div className="h-12 w-12 rounded-full border border-[#f23363] flex items-center justify-center mr-4">
          <span className="text-xl">{teamB.letter}</span>
        </div>
        <div className="flex-grow">
          <div className="font-bold text-white mb-2">{teamB.name}</div>
          <div className="text-xs text-gray-400">
            {teamB.players[0].name} & {teamB.players[1].name}
          </div>
        </div>
        <div className="text-white font-bold text-lg">#{teamB.position}</div>
      </div>
    </div>
  );
};

const BracketView: React.FC = () => {
  // Example matches
  const matches = [
    {
      teamA: {
        name: "Eagles",
        position: 1,
        letter: "E",
        players: [
          { name: "Thomas Müller", rank: 1 },
          { name: "Julia Weber", rank: 2 },
        ],
      },
      teamB: {
        name: "Tigers",
        position: 2,
        letter: "T",
        players: [
          { name: "Michael Schmidt", rank: 3 },
          { name: "Laura Fischer", rank: 4 },
        ],
      },
      playingForPosition: 1,
    },
    {
      teamA: {
        name: "Hawks",
        position: 3,
        letter: "H",
        players: [
          { name: "Stefan Wagner", rank: 5 },
          { name: "Sophia Becker", rank: 6 },
        ],
      },
      teamB: {
        name: "Lions",
        position: 4,
        letter: "L",
        players: [
          { name: "Markus Hoffmann", rank: 7 },
          { name: "Anna Schulz", rank: 8 },
        ],
      },
      playingForPosition: 3,
    },
  ];

  return (
    <div className=" min-h-screen p-2 py-8">
      {matches.map((match, index) => (
        <Match
          key={index}
          teamA={match.teamA}
          teamB={match.teamB}
          playingForPosition={match.playingForPosition}
        />
      ))}
    </div>
  );
};

export default BracketView;
