import { useRef, useEffect } from "react";
import { teams } from "../data/teams";

// Props für die Ladder-Komponente
interface LadderProps {
  playerName: string;
  playerTeamId: string;
  playerRank: number;
}

// Ladder-Komponente
const Ladder: React.FC<LadderProps> = ({
  playerName,
  playerTeamId,
  playerRank,
}) => {
  const team = teams.find((t) => t.id === playerTeamId);
  const teamName = team ? team.name : "UnKnown Team";

  const animationDirection = playerRank % 2 === 0 ? "Right" : "Left";

  // Logik für das Trophy-Icon
  const getTrophyIcon = () => {
    switch (playerRank) {
      case 1:
        return (
          <span className="trophy">
            <i className="ion-trophy" style={{ color: "gold" }}></i>
          </span>
        );
      case 2:
        return (
          <span className="trophy">
            <i className="ion-ribbon-a" style={{ color: "silver" }}></i>
          </span>
        );
      case 3:
        return (
          <span className="trophy">
            <i className="ion-ribbon-b" style={{ color: "#cd7f32" }}></i>
          </span>
        );
      default:
        return null;
    }
  };

  const getRandomColor = () => {
    const colors = [
      "#FF6B6B, #FFA07A", // Red to Light Salmon
      "#FF7F50, #FFD700", // Coral to Gold
      "#FF4500, #FFA500", // OrangeRed to Orange
      "#FF8C00, #FFB347", // DarkOrange to Light Orange
      "#FF6347, #FFCC00", // Tomato to Yellow
      "#FF7043, #FFB74D", // Deep Orange to Amber
      "#FF5722, #FFC107", // Deep Orange to Amber
      "#FF4500, #FFD700", // OrangeRed to Gold
      "#FF6B6B, #FFD700", // Red to Gold
      "#FF7F50, #FFA500", // Coral to Orange
      "#FF5733, #FFC300", // Bright Red-Orange to Yellow
      "#FF4E50, #FFBD69", // Red-Pink to Light Orange
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex].split(", ");
  };

  const photoRef = useRef<HTMLDivElement | null>(null);
  const colorRef = useRef<string[] | null>(null);

  useEffect(() => {
    if (!colorRef.current) {
      colorRef.current = getRandomColor();
    }
    if (photoRef.current && colorRef.current && playerRank > 3) {
      // const color = colorRef.current;
      // const photoStyle = photoRef.current.style;
      // photoStyle.backgroundImage = `linear-gradient(45deg, ${color}, transparent 45%, ${color})`;
      // photoStyle.borderColor = color;
      // photoStyle.color = color;
    }
  }),
    [];

  return (
    <div
      className={`player clearfix rotateInDown${animationDirection} animated`}
    >
      <div className="photo pull-left" ref={photoRef}>
        {teamName === "UnKnown Team" ? "?" : teamName.slice(0, 1)}
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
