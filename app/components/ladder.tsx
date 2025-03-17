import { teams } from "../data/teams";

// Props für die Ladder-Komponente
interface LadderProps {
  playerImage?: string;
  playerName: string;
  playerTeamId: string;
  playerRank: number;
}

// Ladder-Komponente
const Ladder: React.FC<LadderProps> = ({
  playerImage,
  playerName,
  playerTeamId,
  playerRank,
}) => {
  const team = teams.find((t) => t.id === playerTeamId);
  const teamName = team ? team.name : "Unbekanntes Team";

  const animationDirection = playerRank % 2 === 0 ? "Right" : "Left";

  // Logik für das Trophy-Icon
  const getTrophyIcon = () => {
    switch(playerRank) {
      case 1:
        return <span className="trophy"><i className="ion-trophy" style={{ color: "gold" }}></i></span>;
      case 2:
        return <span className="trophy"><i className="ion-ribbon-a" style={{ color: "silver" }}></i></span>;
      case 3:
        return <span className="trophy"><i className="ion-ribbon-b" style={{ color: "#cd7f32" }}></i></span>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`player clearfix rotateInDown${animationDirection} animated`}
    >
      <div className="photo pull-left">
        {playerImage ? (
          <img src={playerImage} alt={playerName} />
        ) : (
          <div className="placeholder-image"></div>
        )}
      </div>
      <div className="desc pull-left">
        <p className="name">{playerName}</p>
        <p className="position">{teamName}</p>
      </div>
      <div className="idle pull-right">
        {getTrophyIcon()}
        <span className="rank">{playerRank}</span>
      </div>
    </div>
  );
};

export default Ladder;