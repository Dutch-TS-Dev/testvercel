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

  // Logik für die random Farbe des Playerfotos
  const getRandomColor = () => {
    // return "#" + Math.floor(Math.random() * 16777215).toString(16);
    const colors = [
      "#86B084", // Original color
      "#7DA3B9", // Blue-gray
      "#B08679", // Dusty rose
      "#A186B0", // Lavender
      "#B0A186", // Tan
      "#79B086", // Seafoam
      "#86B079", // Sage
      "#B079A1", // Mauve
      "#79A1B0", // Steel blue
      "#A1B079", // Olive
      "#B69C78", // Camel
      "#78B69C", // Teal
      "#9C78B6", // Periwinkle
      "#B69C78", // Tan
      "#789CB6", // Powder blue
      "#B6789C", // Dusty pink
      "#9CB678", // Lime
      "#B9847A", // Terracotta
      "#7AB986", // Mint
      "#A37DB0", // Lilac
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);

    return colors[randomIndex];
  };

  const photoRef = useRef<HTMLDivElement | null>(null);
  const colorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!colorRef.current) {
      colorRef.current = getRandomColor();
    }
    if (photoRef.current && colorRef.current && playerRank > 3) {
      const color = colorRef.current;
      const photoStyle = photoRef.current.style;
      photoStyle.backgroundImage = `linear-gradient(45deg, ${color}, transparent 45%, ${color})`;
      photoStyle.borderColor = color;
      photoStyle.color = color;
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
